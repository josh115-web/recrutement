/**
 * Petroleum Club Skikda - HR Evaluation Portal 2026/2027
 * Pure Google Sheets Database Engine (With Smart GAS WebApp URL Auto-Fix & Permission Check)
 */

(function () {
    'use strict';

    // NEW DEPLOYMENT GOOGLE APPS SCRIPT WEB APP URL
    const RAW_GAS_URL = 'https://script.google.com/macros/s/AKfycbz2xqOvPw_pEuacd-WQTadMsrZc2yAVug1DKas-OS04/exec';

    function normalizeGasUrl(url) {
        if (!url) return '';
        let clean = url.trim();
        // Automatically convert development URL (/dev) to production WebApp URL (/exec)
        if (clean.endsWith('/dev')) {
            clean = clean.replace(/\/dev$/, '/exec');
        }
        return clean;
    }

    // STATE (Single Source of Truth: Google Sheets API)
    let state = {
        candidates: [],
        gasUrl: normalizeGasUrl(localStorage.getItem('petroleum_gas_url')) || RAW_GAS_URL,
        isOnline: false,
        isLoading: false,
        searchQuery: '',
        filterSpecialty: 'ALL',
        filterSkill: 'ALL',
        filterLevel: 'ALL',
        filterPunctuality: 'ALL',
        activeEditCandidateId: null,
        candidateToDeleteId: null
    };

    // DOM ELEMENTS CACHE
    const elements = {
        // Stats
        statTotalCandidates: document.getElementById('statTotalCandidates'),
        statAverageScore: document.getElementById('statAverageScore'),
        statAverageRatingLabel: document.getElementById('statAverageRatingLabel'),
        statTopScore: document.getElementById('statTopScore'),
        statTopCandidateName: document.getElementById('statTopCandidateName'),
        statOnTimeRate: document.getElementById('statOnTimeRate'),
        statOnTimeCount: document.getElementById('statOnTimeCount'),
        statLateCount: document.getElementById('statLateCount'),

        // Grid & Loading
        candidatesGrid: document.getElementById('candidatesGrid'),
        loadingState: document.getElementById('loadingState'),
        emptyState: document.getElementById('emptyState'),
        visibleCandidatesCount: document.getElementById('visibleCandidatesCount'),

        // Filters & Search & Hashtags
        searchInput: document.getElementById('searchInput'),
        clearSearchBtn: document.getElementById('clearSearchBtn'),
        filterSpecialty: document.getElementById('filterSpecialty'),
        filterSkill: document.getElementById('filterSkill'),
        filterLevel: document.getElementById('filterLevel'),
        filterPunctuality: document.getElementById('filterPunctuality'),
        resetFiltersBtn: document.getElementById('resetFiltersBtn'),
        activeHashtagsBar: document.getElementById('activeHashtagsBar'),

        // Header Triggers
        openAddModalBtn: document.getElementById('openAddModalBtn'),
        emptyAddBtn: document.getElementById('emptyAddBtn'),
        openSettingsBtn: document.getElementById('openSettingsBtn'),
        syncStatusBtn: document.getElementById('syncStatusBtn'),
        syncDot: document.getElementById('syncDot'),
        syncText: document.getElementById('syncText'),
        syncDotMobile: document.getElementById('syncDotMobile'),
        syncTextMobile: document.getElementById('syncTextMobile'),
        exportDropdownBtn: document.getElementById('exportDropdownBtn'),
        exportMenu: document.getElementById('exportMenu'),
        exportCSVBtn: document.getElementById('exportCSVBtn'),
        exportJSONBtn: document.getElementById('exportJSONBtn'),
        footerGASLink: document.getElementById('footerGASLink'),

        // Candidate Evaluation Modal
        candidateModal: document.getElementById('candidateModal'),
        modalTitle: document.getElementById('modalTitle'),
        candidateForm: document.getElementById('candidateForm'),
        candidateId: document.getElementById('candidateId'),
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        specialty: document.getElementById('specialty'),
        skillsHashtags: document.getElementById('skillsHashtags'),
        studyLevel: document.getElementById('studyLevel'),
        scheduledTime: document.getElementById('scheduledTime'),
        arrivalTime: document.getElementById('arrivalTime'),
        setNowBtn: document.getElementById('setNowBtn'),
        delayBadgeDisplay: document.getElementById('delayBadgeDisplay'),
        remarks: document.getElementById('remarks'),
        closeCandidateModalBtn: document.getElementById('closeCandidateModalBtn'),
        cancelCandidateBtn: document.getElementById('cancelCandidateBtn'),
        saveCandidateBtn: document.getElementById('saveCandidateBtn'),

        // Score Sliders & Displays
        formTotalDisplay: document.getElementById('formTotalDisplay'),
        skillsTotalDisplay: document.getElementById('skillsTotalDisplay'),
        rhTotalDisplay: document.getElementById('rhTotalDisplay'),
        liveFinalScore: document.getElementById('liveFinalScore'),
        scoreRatingBadge: document.getElementById('scoreRatingBadge'),

        score_motivation: document.getElementById('score_motivation'),
        score_benevolat: document.getElementById('score_benevolat'),
        score_idees: document.getElementById('score_idees'),
        score_disponibilite: document.getElementById('score_disponibilite'),
        val_motivation: document.getElementById('val_motivation'),
        val_benevolat: document.getElementById('val_benevolat'),
        val_idees: document.getElementById('val_idees'),
        val_disponibilite: document.getElementById('val_disponibilite'),

        score_hardskills: document.getElementById('score_hardskills'),
        score_parcours: document.getElementById('score_parcours'),
        score_coherence: document.getElementById('score_coherence'),
        val_hardskills: document.getElementById('val_hardskills'),
        val_parcours: document.getElementById('val_parcours'),
        val_coherence: document.getElementById('val_coherence'),

        score_gestionTemps: document.getElementById('score_gestionTemps'),
        score_stress: document.getElementById('score_stress'),
        score_travailEquipe: document.getElementById('score_travailEquipe'),
        score_ethique: document.getElementById('score_ethique'),
        val_gestionTemps: document.getElementById('val_gestionTemps'),
        val_stress: document.getElementById('val_stress'),
        val_travailEquipe: document.getElementById('val_travailEquipe'),
        val_ethique: document.getElementById('val_ethique'),

        // Settings Modal
        settingsModal: document.getElementById('settingsModal'),
        gasUrlInput: document.getElementById('gasUrlInput'),
        testGasUrlBtn: document.getElementById('testGasUrlBtn'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),
        closeSettingsModalBtn: document.getElementById('closeSettingsModalBtn'),
        copyGasCodeBtn: document.getElementById('copyGasCodeBtn'),
        resetDemoDataBtn: document.getElementById('resetDemoDataBtn'),

        // Delete Modal
        deleteModal: document.getElementById('deleteModal'),
        deleteCandidateName: document.getElementById('deleteCandidateName'),
        confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
        cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),

        // Detail Modal
        detailModal: document.getElementById('detailModal'),
        detailRankBadge: document.getElementById('detailRankBadge'),
        detailFullName: document.getElementById('detailFullName'),
        detailEmail: document.getElementById('detailEmail'),
        detailContent: document.getElementById('detailContent'),
        closeDetailModalBtn: document.getElementById('closeDetailModalBtn'),

        // Toast Container
        toastContainer: document.getElementById('toastContainer')
    };

    // INIT APP
    function init() {
        localStorage.removeItem('petroleum_candidates_cache');

        bindEvents();
        calculateLiveScoresInModal();
        
        // Initial fetch directly from Google Sheets
        fetchFromGAS();
    }

    // EVENT BINDINGS
    function bindEvents() {
        elements.openAddModalBtn.addEventListener('click', () => openCandidateModal());
        elements.emptyAddBtn.addEventListener('click', () => openCandidateModal());

        elements.closeCandidateModalBtn.addEventListener('click', closeCandidateModal);
        elements.cancelCandidateBtn.addEventListener('click', closeCandidateModal);

        elements.candidateForm.addEventListener('submit', handleFormSubmit);

        elements.setNowBtn.addEventListener('click', setArrivalTimeToNow);

        elements.scheduledTime.addEventListener('input', updateDelayDisplay);
        elements.arrivalTime.addEventListener('input', updateDelayDisplay);

        elements.specialty.addEventListener('blur', () => {
            elements.specialty.value = formatHashtagString(elements.specialty.value);
        });
        elements.skillsHashtags.addEventListener('blur', () => {
            elements.skillsHashtags.value = formatHashtagString(elements.skillsHashtags.value);
        });

        const sliders = [
            'score_motivation', 'score_benevolat', 'score_idees', 'score_disponibilite',
            'score_hardskills', 'score_parcours', 'score_coherence',
            'score_gestionTemps', 'score_stress', 'score_travailEquipe', 'score_ethique'
        ];

        sliders.forEach(id => {
            const slider = document.getElementById(id);
            if (slider) {
                slider.addEventListener('input', () => {
                    const valEl = document.getElementById(`val_${id.replace('score_', '')}`);
                    if (valEl) valEl.textContent = slider.value;
                    calculateLiveScoresInModal();
                });
            }
        });

        elements.searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.toLowerCase().trim();
            elements.clearSearchBtn.classList.toggle('hidden', !state.searchQuery);
            renderCandidates();
        });

        elements.clearSearchBtn.addEventListener('click', () => {
            elements.searchInput.value = '';
            state.searchQuery = '';
            elements.clearSearchBtn.classList.add('hidden');
            renderCandidates();
        });

        elements.filterSpecialty.addEventListener('change', (e) => {
            state.filterSpecialty = e.target.value;
            renderCandidates();
        });

        elements.filterSkill.addEventListener('change', (e) => {
            state.filterSkill = e.target.value;
            renderCandidates();
        });

        elements.filterLevel.addEventListener('change', (e) => {
            state.filterLevel = e.target.value;
            renderCandidates();
        });

        elements.filterPunctuality.addEventListener('change', (e) => {
            state.filterPunctuality = e.target.value;
            renderCandidates();
        });

        elements.resetFiltersBtn.addEventListener('click', () => {
            elements.searchInput.value = '';
            elements.clearSearchBtn.classList.add('hidden');
            elements.filterSpecialty.value = 'ALL';
            elements.filterSkill.value = 'ALL';
            elements.filterLevel.value = 'ALL';
            elements.filterPunctuality.value = 'ALL';
            state.searchQuery = '';
            state.filterSpecialty = 'ALL';
            state.filterSkill = 'ALL';
            state.filterLevel = 'ALL';
            state.filterPunctuality = 'ALL';
            renderCandidates();
            showToast('Filtres réinitialisés', 'info');
        });

        elements.openSettingsBtn.addEventListener('click', openSettingsModal);
        elements.syncStatusBtn.addEventListener('click', openSettingsModal);
        elements.footerGASLink.addEventListener('click', openSettingsModal);
        elements.closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
        elements.saveSettingsBtn.addEventListener('click', handleSaveSettings);
        elements.testGasUrlBtn.addEventListener('click', handleTestGasUrl);
        elements.copyGasCodeBtn.addEventListener('click', handleCopyGasCode);
        elements.resetDemoDataBtn.addEventListener('click', handleRefreshFromGAS);

        elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);
        elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);

        elements.closeDetailModalBtn.addEventListener('click', () => {
            elements.detailModal.classList.add('hidden');
        });

        elements.exportDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.exportMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            elements.exportMenu.classList.add('hidden');
        });

        elements.exportCSVBtn.addEventListener('click', exportToCSV);
        elements.exportJSONBtn.addEventListener('click', exportToJSON);
    }

    // HASHTAG UTILITY FUNCTIONS
    function extractHashtags(str) {
        if (!str) return [];
        const matches = str.match(/#[^\s#,;]+/g);
        if (matches && matches.length > 0) {
            return matches.map(tag => tag.trim());
        }
        return str
            .split(/[\s,;]+/)
            .filter(Boolean)
            .map(word => word.startsWith('#') ? word : `#${word}`);
    }

    function formatHashtagString(str) {
        const tags = extractHashtags(str);
        return tags.join(' ');
    }

    function updateHashtagsFilterOptions() {
        const specialtyTagsSet = new Set();
        const skillTagsSet = new Set();

        state.candidates.forEach(c => {
            const specTags = extractHashtags(c.specialty);
            specTags.forEach(tag => specialtyTagsSet.add(tag));

            const skTags = extractHashtags(c.skillsHashtags);
            skTags.forEach(tag => skillTagsSet.add(tag));
        });

        const currentSpecVal = state.filterSpecialty;
        const currentSkillVal = state.filterSkill;

        let specOptionsHTML = `<option value="ALL">🏷️ Toute Spécialité (#)</option>`;
        Array.from(specialtyTagsSet).sort().forEach(tag => {
            specOptionsHTML += `<option value="${escapeHTML(tag)}">${escapeHTML(tag)}</option>`;
        });
        elements.filterSpecialty.innerHTML = specOptionsHTML;
        elements.filterSpecialty.value = currentSpecVal;

        let skillOptionsHTML = `<option value="ALL">⚡ Tous les Skills (#)</option>`;
        Array.from(skillTagsSet).sort().forEach(tag => {
            skillOptionsHTML += `<option value="${escapeHTML(tag)}">${escapeHTML(tag)}</option>`;
        });
        elements.filterSkill.innerHTML = skillOptionsHTML;
        elements.filterSkill.value = currentSkillVal;

        const allTags = [...Array.from(specialtyTagsSet), ...Array.from(skillTagsSet)];
        if (allTags.length === 0) {
            elements.activeHashtagsBar.innerHTML = `<span class="text-[11px] text-slate-500 italic">Aucun hashtag enregistré dans le Sheet</span>`;
            return;
        }

        const topTags = allTags.slice(0, 12);
        const quickPillsHTML = `<span class="text-[11px] text-slate-500 font-semibold mr-1">Filtrer par Hashtag :</span>` +
            topTags.map(tag => `
                <button class="btn-quick-hashtag px-2 py-0.5 rounded-lg text-[11px] font-semibold transition ${state.filterSpecialty === tag || state.filterSkill === tag || state.searchQuery === tag.toLowerCase() ? 'bg-petroleum-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-petroleum-500/20 hover:text-petroleum-400 border border-slate-700'}" data-tag="${escapeHTML(tag)}">
                    ${escapeHTML(tag)}
                </button>
            `).join('');

        elements.activeHashtagsBar.innerHTML = quickPillsHTML;

        document.querySelectorAll('.btn-quick-hashtag').forEach(btn => {
            btn.addEventListener('click', () => {
                const tag = btn.getAttribute('data-tag');
                if (state.filterSpecialty === tag || state.filterSkill === tag) {
                    state.filterSpecialty = 'ALL';
                    state.filterSkill = 'ALL';
                    state.searchQuery = '';
                    elements.searchInput.value = '';
                } else {
                    state.searchQuery = tag.toLowerCase();
                    elements.searchInput.value = tag;
                    elements.clearSearchBtn.classList.remove('hidden');
                }
                renderCandidates();
            });
        });
    }

    // DIRECT GOOGLE SHEETS API READ ENGINE
    async function fetchFromGAS() {
        const url = normalizeGasUrl(state.gasUrl);
        if (!url) return;

        showLoading(true);
        try {
            const response = await fetch(url, {
                method: 'GET',
                redirect: 'follow'
            });

            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

            const textResponse = await response.text();

            // Detect if Google returned a sign-in HTML page instead of JSON
            if (textResponse.trim().startsWith('<') || textResponse.includes('accounts.google.com')) {
                updateSyncStatusUI(false, "Accès Google Déploiement à Régler");
                showToast("Accès Google Sheets à modifier: Déployer en 'Tout le monde' (Anyone)", "warning");
                state.candidates = [];
                renderCandidates();
                return;
            }

            const data = JSON.parse(textResponse);

            let rawCandidates = [];
            if (Array.isArray(data)) {
                rawCandidates = data;
            } else if (data && Array.isArray(data.candidates)) {
                rawCandidates = data.candidates;
            } else if (data && Array.isArray(data.data)) {
                rawCandidates = data.data;
            }

            state.candidates = rawCandidates.map(item => ({
                id: String(item.id || 'cand-' + Math.random().toString(36).substr(2, 9)),
                fullName: String(item.fullName || item.nom_prenom || item.name || ''),
                email: String(item.email || ''),
                specialty: formatHashtagString(item.specialty || item.specialite || ''),
                skillsHashtags: formatHashtagString(item.skillsHashtags || item.skills || ''),
                studyLevel: String(item.studyLevel || item.niveau || 'L1'),
                scheduledTime: String(item.scheduledTime || item.heure_prevue || '09:00'),
                arrivalTime: String(item.arrivalTime || item.heure_arrivee || '09:00'),
                delayMinutes: Number(item.delayMinutes || item.retard_minutes || 0),
                formulaireScore: Number(item.formulaireScore || item.note_formulaire || 0),
                skillsScore: Number(item.skillsScore || item.note_skills || 0),
                rhScore: Number(item.rhScore || item.note_rh || 0),
                finalScore: Number(item.finalScore || item.note_generale || item.final_score || 0),
                remarks: String(item.remarks || item.remarques || ''),
                updatedAt: String(item.updatedAt || new Date().toISOString())
            }));

            updateSyncStatusUI(true, "Base Google Sheets en Direct");
        } catch (err) {
            console.error("Erreur de connexion Google Sheets:", err);
            updateSyncStatusUI(false, "Erreur API Google Sheets");
            showToast("Vérifier l'URL et les permissions du WebApp Apps Script", "error");
        } finally {
            showLoading(false);
            renderCandidates();
        }
    }

    // DIRECT GOOGLE SHEETS API WRITE ENGINE
    async function sendToGAS(action, candidateData) {
        const url = normalizeGasUrl(state.gasUrl);
        if (!url) return false;

        try {
            const payload = {
                action: action,
                data: candidateData,
                id: candidateData ? candidateData.id : null,
                fullName: candidateData ? candidateData.fullName : null,
                email: candidateData ? candidateData.email : null,
                specialty: candidateData ? candidateData.specialty : null,
                skillsHashtags: candidateData ? candidateData.skillsHashtags : null,
                studyLevel: candidateData ? candidateData.studyLevel : null,
                scheduledTime: candidateData ? candidateData.scheduledTime : null,
                arrivalTime: candidateData ? candidateData.arrivalTime : null,
                delayMinutes: candidateData ? candidateData.delayMinutes : 0,
                formulaireScore: candidateData ? candidateData.formulaireScore : 0,
                skillsScore: candidateData ? candidateData.skillsScore : 0,
                rhScore: candidateData ? candidateData.rhScore : 0,
                finalScore: candidateData ? candidateData.finalScore : 0,
                remarks: candidateData ? candidateData.remarks : null
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload),
                redirect: 'follow'
            });

            const textResponse = await response.text();
            if (textResponse.trim().startsWith('<')) return false;

            const result = JSON.parse(textResponse);
            return result && (result.status === 'success' || result.action);
        } catch (err) {
            console.error(`Échec d'écriture Google Sheets (${action}):`, err);
            return false;
        }
    }

    function updateSyncStatusUI(isOnline, text) {
        state.isOnline = isOnline;
        elements.syncText.textContent = text;
        elements.syncTextMobile.textContent = isOnline ? "Google Sheets" : "Erreur GS";

        if (isOnline) {
            elements.syncDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
            elements.syncDotMobile.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
        } else {
            elements.syncDot.className = "w-2.5 h-2.5 rounded-full bg-red-500";
            elements.syncDotMobile.className = "w-2 h-2 rounded-full bg-red-500";
        }
    }

    // REAL-TIME SORTING & RENDERING ENGINE
    function renderCandidates() {
        const sortedCandidates = [...state.candidates].sort((a, b) => b.finalScore - a.finalScore);

        updateHashtagsFilterOptions();

        const filtered = sortedCandidates.filter(c => {
            const q = state.searchQuery.toLowerCase();
            const specLower = (c.specialty || '').toLowerCase();
            const skillsLower = (c.skillsHashtags || '').toLowerCase();

            const matchesSearch = !q ||
                c.fullName.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                specLower.includes(q) ||
                skillsLower.includes(q) ||
                (c.remarks && c.remarks.toLowerCase().includes(q));

            const matchesSpecialty = state.filterSpecialty === 'ALL' ||
                specLower.includes(state.filterSpecialty.toLowerCase());

            const matchesSkill = state.filterSkill === 'ALL' ||
                skillsLower.includes(state.filterSkill.toLowerCase());

            const matchesLevel = state.filterLevel === 'ALL' || c.studyLevel === state.filterLevel;

            const matchesPunctuality = state.filterPunctuality === 'ALL' ||
                (state.filterPunctuality === 'ON_TIME' && c.delayMinutes <= 0) ||
                (state.filterPunctuality === 'LATE' && c.delayMinutes > 0);

            return matchesSearch && matchesSpecialty && matchesSkill && matchesLevel && matchesPunctuality;
        });

        elements.visibleCandidatesCount.textContent = filtered.length;

        renderDashboardStats(sortedCandidates);

        if (filtered.length === 0) {
            elements.candidatesGrid.innerHTML = '';
            elements.emptyState.classList.remove('hidden');
            return;
        }

        elements.emptyState.classList.add('hidden');

        const html = filtered.map(c => {
            const globalRank = sortedCandidates.findIndex(item => item.id === c.id) + 1;
            return createCandidateCardHTML(c, globalRank);
        }).join('');

        elements.candidatesGrid.innerHTML = html;

        attachCardListeners();
    }

    function renderDashboardStats(sortedCandidates) {
        const total = sortedCandidates.length;
        elements.statTotalCandidates.textContent = total;

        if (total === 0) {
            elements.statAverageScore.innerHTML = `0.00 <span class="text-xs font-normal text-slate-500">/20</span>`;
            elements.statAverageRatingLabel.textContent = "Aucune donnée";
            elements.statTopScore.innerHTML = `0.00 <span class="text-xs font-normal text-slate-500">/20</span>`;
            elements.statTopCandidateName.textContent = "Aucun candidat dans le Sheet";
            elements.statOnTimeRate.textContent = "0%";
            elements.statOnTimeCount.textContent = "0 à l'heure";
            elements.statLateCount.textContent = "0 retard";
            return;
        }

        const sumScores = sortedCandidates.reduce((acc, c) => acc + c.finalScore, 0);
        const avg = (sumScores / total).toFixed(2);
        elements.statAverageScore.innerHTML = `${avg} <span class="text-xs font-normal text-slate-500">/20</span>`;
        elements.statAverageRatingLabel.textContent = getScoreRatingLabel(avg);

        const topCandidate = sortedCandidates[0];
        elements.statTopScore.innerHTML = `${topCandidate.finalScore.toFixed(2)} <span class="text-xs font-normal text-slate-500">/20</span>`;
        elements.statTopCandidateName.innerHTML = `<i class="fa-solid fa-trophy text-amber-400 mr-1"></i> #${1} ${escapeHTML(topCandidate.fullName)}`;

        const onTimeCount = sortedCandidates.filter(c => c.delayMinutes <= 0).length;
        const lateCount = total - onTimeCount;
        const rate = Math.round((onTimeCount / total) * 100);

        elements.statOnTimeRate.textContent = `${rate}%`;
        elements.statOnTimeCount.textContent = `${onTimeCount} à l'heure`;
        elements.statLateCount.textContent = `${lateCount} retard${lateCount > 1 ? 's' : ''}`;
    }

    // CANDIDATE CARD COMPONENT TEMPLATE
    function createCandidateCardHTML(candidate, rank) {
        let rankBadgeClass = "bg-slate-800 border-slate-700 text-slate-300";
        let rankIcon = `#${rank}`;
        let cardGlow = "";

        if (rank === 1) {
            rankBadgeClass = "bg-gradient-to-r from-amber-500 to-petroleum-500 text-white font-black shadow-lg shadow-amber-500/30 border-amber-400";
            rankIcon = `<i class="fa-solid fa-crown text-xs text-amber-200 mr-1"></i> #1`;
            cardGlow = "rank-1-glow border-petroleum-500/50 bg-gradient-to-b from-petroleum-950/20 to-darkslate-900";
        } else if (rank === 2) {
            rankBadgeClass = "bg-slate-700 text-slate-100 font-bold border-slate-500";
            rankIcon = `<i class="fa-solid fa-medal text-xs text-slate-300 mr-1"></i> #2`;
        } else if (rank === 3) {
            rankBadgeClass = "bg-amber-900/60 text-amber-300 font-bold border-amber-700/60";
            rankIcon = `<i class="fa-solid fa-award text-xs text-amber-400 mr-1"></i> #3`;
        }

        const isLate = candidate.delayMinutes > 0;
        const delayBadgeHTML = isLate
            ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold">
                 <i class="fa-solid fa-clock text-[10px]"></i> Retard (+${candidate.delayMinutes} min)
               </span>`
            : `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                 <i class="fa-solid fa-circle-check text-[10px]"></i> À l'heure
               </span>`;

        const specTags = extractHashtags(candidate.specialty);
        const specBadgesHTML = specTags.map(tag => `
            <button class="btn-hashtag-filter px-2.5 py-0.5 rounded-full bg-petroleum-500/10 hover:bg-petroleum-500/20 text-petroleum-400 border border-petroleum-500/20 text-[11px] font-semibold transition" data-tag="${escapeHTML(tag)}">
                ${escapeHTML(tag)}
            </button>
        `).join('');

        const skillTags = extractHashtags(candidate.skillsHashtags);
        const skillBadgesHTML = skillTags.map(tag => `
            <button class="btn-hashtag-filter px-2.5 py-0.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold transition" data-tag="${escapeHTML(tag)}">
                ${escapeHTML(tag)}
            </button>
        `).join('');

        const formPct = Math.round((candidate.formulaireScore / 20) * 100);
        const skillsPct = Math.round((candidate.skillsScore / 20) * 100);
        const rhPct = Math.round((candidate.rhScore / 20) * 100);

        return `
        <div class="candidate-card bg-darkslate-900/90 border border-slate-800 rounded-3xl p-5 relative flex flex-col justify-between space-y-4 shadow-xl ${cardGlow}">
            
            <div class="space-y-3">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center space-x-3">
                        <span class="px-3 py-1 rounded-xl border text-xs flex items-center justify-center ${rankBadgeClass}">
                            ${rankIcon}
                        </span>
                        <div>
                            <h3 class="text-base font-extrabold text-white tracking-tight leading-snug">
                                ${escapeHTML(candidate.fullName)}
                            </h3>
                            <p class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <i class="fa-regular fa-envelope text-[11px]"></i>
                                <span class="truncate max-w-[170px] sm:max-w-[200px]">${escapeHTML(candidate.email)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                    <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold">
                        ${escapeHTML(candidate.studyLevel)}
                    </span>
                    ${specBadgesHTML}
                    ${skillBadgesHTML}
                    ${delayBadgeHTML}
                </div>
            </div>

            <div class="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-between">
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Note Générale Finale</span>
                    <div class="text-2xl sm:text-3xl font-black text-petroleum-400 tracking-tight mt-0.5">
                        ${candidate.finalScore.toFixed(2)} <span class="text-xs font-normal text-slate-500">/ 20</span>
                    </div>
                </div>

                <div class="text-right">
                    <span class="text-[10px] font-semibold text-slate-500 block">Arrivée: ${candidate.arrivalTime || '--:--'}</span>
                    <span class="text-[10px] font-medium text-slate-400 block">Convoqué: ${candidate.scheduledTime || '--:--'}</span>
                </div>
            </div>

            <div class="space-y-2 text-xs">
                <div class="space-y-1">
                    <div class="flex justify-between text-slate-400 font-medium text-[11px]">
                        <span>Note Formulaire</span>
                        <span class="text-amber-400 font-bold">${candidate.formulaireScore.toFixed(2)} / 20</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-500 rounded-full" style="width: ${formPct}%"></div>
                    </div>
                </div>

                <div class="space-y-1">
                    <div class="flex justify-between text-slate-400 font-medium text-[11px]">
                        <span>Skills & Académique</span>
                        <span class="text-blue-400 font-bold">${candidate.skillsScore.toFixed(2)} / 20</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full" style="width: ${skillsPct}%"></div>
                    </div>
                </div>

                <div class="space-y-1">
                    <div class="flex justify-between text-slate-400 font-medium text-[11px]">
                        <span>Situation RH</span>
                        <span class="text-emerald-400 font-bold">${candidate.rhScore.toFixed(2)} / 20</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" style="width: ${rhPct}%"></div>
                    </div>
                </div>
            </div>

            <div class="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 line-clamp-2 min-h-[52px] italic">
                "${candidate.remarks ? escapeHTML(candidate.remarks) : 'Aucune remarque renseignée.'}"
            </div>

            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button class="btn-view-detail text-slate-400 hover:text-white transition flex items-center gap-1 font-semibold" data-id="${candidate.id}">
                    <i class="fa-regular fa-eye"></i> Détailler
                </button>

                <div class="flex items-center space-x-2">
                    <button class="btn-edit-candidate p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-petroleum-400 transition" title="Modifier le candidat" data-id="${candidate.id}">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-delete-candidate p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition" title="Supprimer le candidat" data-id="${candidate.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>

        </div>
        `;
    }

    function attachCardListeners() {
        document.querySelectorAll('.btn-edit-candidate').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openCandidateModal(id);
            });
        });

        document.querySelectorAll('.btn-delete-candidate').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openDeleteModal(id);
            });
        });

        document.querySelectorAll('.btn-view-detail').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openDetailModal(id);
            });
        });

        document.querySelectorAll('.btn-hashtag-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tag = btn.getAttribute('data-tag');
                state.searchQuery = tag.toLowerCase();
                elements.searchInput.value = tag;
                elements.clearSearchBtn.classList.remove('hidden');
                renderCandidates();
                showToast(`Filtré par le hashtag ${tag}`, 'info');
            });
        });
    }

    function calculateLiveScoresInModal() {
        const mot = parseFloat(elements.score_motivation.value) || 0;
        const ben = parseFloat(elements.score_benevolat.value) || 0;
        const ide = parseFloat(elements.score_idees.value) || 0;
        const dis = parseFloat(elements.score_disponibilite.value) || 0;
        const formTotal = mot + ben + ide + dis;
        elements.formTotalDisplay.textContent = formTotal.toFixed(2);

        const hs = parseFloat(elements.score_hardskills.value) || 0;
        const pa = parseFloat(elements.score_parcours.value) || 0;
        const co = parseFloat(elements.score_coherence.value) || 0;
        const skillsTotal = hs + pa + co;
        elements.skillsTotalDisplay.textContent = skillsTotal.toFixed(2);

        const gt = parseFloat(elements.score_gestionTemps.value) || 0;
        const st = parseFloat(elements.score_stress.value) || 0;
        const te = parseFloat(elements.score_travailEquipe.value) || 0;
        const et = parseFloat(elements.score_ethique.value) || 0;
        const rhTotal = gt + st + te + et;
        elements.rhTotalDisplay.textContent = rhTotal.toFixed(2);

        const finalScore = (formTotal + skillsTotal + rhTotal) / 3;
        const finalFormatted = finalScore.toFixed(2);

        elements.liveFinalScore.innerHTML = `${finalFormatted} <span class="text-sm text-slate-500 font-normal">/ 20</span>`;
        elements.scoreRatingBadge.textContent = getScoreRatingLabel(finalScore);

        return {
            formTotal,
            skillsTotal,
            rhTotal,
            finalScore
        };
    }

    function setArrivalTimeToNow() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        elements.arrivalTime.value = `${hours}:${minutes}`;
        updateDelayDisplay();
    }

    function updateDelayDisplay() {
        const sched = elements.scheduledTime.value;
        const arr = elements.arrivalTime.value;

        if (!sched || !arr) {
            elements.delayBadgeDisplay.className = "h-8 flex items-center justify-center px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold";
            elements.delayBadgeDisplay.innerHTML = `<i class="fa-solid fa-clock mr-1.5"></i> Non spécifié`;
            return 0;
        }

        const [sH, sM] = sched.split(':').map(Number);
        const [aH, aM] = arr.split(':').map(Number);

        const schedMinutes = sH * 60 + sM;
        const arrMinutes = aH * 60 + aM;

        const delay = Math.max(0, arrMinutes - schedMinutes);

        if (delay === 0) {
            elements.delayBadgeDisplay.className = "h-8 flex items-center justify-center px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold";
            elements.delayBadgeDisplay.innerHTML = `<i class="fa-solid fa-circle-check mr-1.5"></i> À l'heure (0 min)`;
        } else {
            elements.delayBadgeDisplay.className = "h-8 flex items-center justify-center px-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold";
            elements.delayBadgeDisplay.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1.5"></i> Retard (+${delay} min)`;
        }

        return delay;
    }

    function openCandidateModal(candidateId = null) {
        state.activeEditCandidateId = candidateId;

        if (candidateId) {
            const candidate = state.candidates.find(c => c.id === candidateId);
            if (!candidate) return;

            elements.modalTitle.textContent = "Modifier l'évaluation du Candidat";
            elements.candidateId.value = candidate.id;
            elements.fullName.value = candidate.fullName;
            elements.email.value = candidate.email;
            elements.specialty.value = candidate.specialty || '';
            elements.skillsHashtags.value = candidate.skillsHashtags || '';
            elements.studyLevel.value = candidate.studyLevel;
            elements.scheduledTime.value = candidate.scheduledTime || "09:00";
            elements.arrivalTime.value = candidate.arrivalTime || "09:00";
            elements.remarks.value = candidate.remarks || "";

            elements.score_motivation.value = 4;
            elements.score_benevolat.value = 4;
            elements.score_idees.value = 4;
            elements.score_disponibilite.value = Math.max(0, candidate.formulaireScore - 12);
            elements.val_motivation.textContent = 4;
            elements.val_benevolat.textContent = 4;
            elements.val_idees.textContent = 4;
            elements.val_disponibilite.textContent = elements.score_disponibilite.value;

            elements.score_hardskills.value = Math.min(8, candidate.skillsScore * 0.4);
            elements.score_parcours.value = Math.min(6, candidate.skillsScore * 0.3);
            elements.score_coherence.value = Math.min(6, candidate.skillsScore * 0.3);
            elements.val_hardskills.textContent = elements.score_hardskills.value;
            elements.val_parcours.textContent = elements.score_parcours.value;
            elements.val_coherence.textContent = elements.score_coherence.value;

            elements.score_gestionTemps.value = 4;
            elements.score_stress.value = 4;
            elements.score_travailEquipe.value = 4;
            elements.score_ethique.value = Math.max(0, candidate.rhScore - 12);
            elements.val_gestionTemps.textContent = 4;
            elements.val_stress.textContent = 4;
            elements.val_travailEquipe.textContent = 4;
            elements.val_ethique.textContent = elements.score_ethique.value;

        } else {
            elements.modalTitle.textContent = "Évaluer un Nouveau Candidat";
            elements.candidateForm.reset();
            elements.candidateId.value = '';

            elements.score_motivation.value = 4;
            elements.score_benevolat.value = 3.5;
            elements.score_idees.value = 4;
            elements.score_disponibilite.value = 3.5;
            elements.val_motivation.textContent = 4;
            elements.val_benevolat.textContent = 3.5;
            elements.val_idees.textContent = 4;
            elements.val_disponibilite.textContent = 3.5;

            elements.score_hardskills.value = 6;
            elements.score_parcours.value = 4.5;
            elements.score_coherence.value = 4.5;
            elements.val_hardskills.textContent = 6;
            elements.val_parcours.textContent = 4.5;
            elements.val_coherence.textContent = 4.5;

            elements.score_gestionTemps.value = 4;
            elements.score_stress.value = 3.5;
            elements.score_travailEquipe.value = 4;
            elements.score_ethique.value = 3.5;
            elements.val_gestionTemps.textContent = 4;
            elements.val_stress.textContent = 3.5;
            elements.val_travailEquipe.textContent = 4;
            elements.val_ethique.textContent = 3.5;
        }

        updateDelayDisplay();
        calculateLiveScoresInModal();

        elements.candidateModal.classList.remove('hidden');
    }

    function closeCandidateModal() {
        elements.candidateModal.classList.add('hidden');
        state.activeEditCandidateId = null;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const id = elements.candidateId.value || 'cand-' + Date.now();
        const scores = calculateLiveScoresInModal();
        const delayMinutes = updateDelayDisplay();

        const candidateData = {
            id: id,
            fullName: elements.fullName.value.trim(),
            email: elements.email.value.trim(),
            specialty: formatHashtagString(elements.specialty.value),
            skillsHashtags: formatHashtagString(elements.skillsHashtags.value),
            studyLevel: elements.studyLevel.value,
            scheduledTime: elements.scheduledTime.value,
            arrivalTime: elements.arrivalTime.value,
            delayMinutes: delayMinutes,
            formulaireScore: scores.formTotal,
            skillsScore: scores.skillsTotal,
            rhScore: scores.rhTotal,
            finalScore: scores.finalScore,
            remarks: elements.remarks.value.trim(),
            updatedAt: new Date().toISOString()
        };

        const isEdit = Boolean(elements.candidateId.value);
        closeCandidateModal();

        showLoading(true);
        showToast("Enregistrement direct dans la feuille Google Sheets...", "info");

        const gasAction = isEdit ? 'update' : 'add';
        await sendToGAS(gasAction, candidateData);

        await fetchFromGAS();

        const actionText = isEdit ? "modifié" : "ajouté";
        showToast(`Candidat ${candidateData.fullName} ${actionText} dans Google Sheets !`, "success");
    }

    function openDeleteModal(id) {
        state.candidateToDeleteId = id;
        const candidate = state.candidates.find(c => c.id === id);
        if (candidate) {
            elements.deleteCandidateName.textContent = candidate.fullName;
            elements.deleteModal.classList.remove('hidden');
        }
    }

    function closeDeleteModal() {
        elements.deleteModal.classList.add('hidden');
        state.candidateToDeleteId = null;
    }

    async function handleConfirmDelete() {
        const id = state.candidateToDeleteId;
        if (!id) return;

        const candidate = state.candidates.find(c => c.id === id);
        const name = candidate ? candidate.fullName : "le candidat";

        closeDeleteModal();
        showLoading(true);
        showToast(`Suppression de ${name} dans Google Sheets...`, "info");

        await sendToGAS('delete', { id: id });
        await fetchFromGAS();

        showToast(`Candidat ${name} supprimé de Google Sheets`, "success");
    }

    function openDetailModal(id) {
        const sorted = [...state.candidates].sort((a, b) => b.finalScore - a.finalScore);
        const rank = sorted.findIndex(c => c.id === id) + 1;
        const c = state.candidates.find(item => item.id === id);

        if (!c) return;

        elements.detailRankBadge.textContent = `#${rank}`;
        elements.detailFullName.textContent = c.fullName;
        elements.detailEmail.textContent = c.email;

        const specBadges = extractHashtags(c.specialty).map(t => `<span class="px-2 py-0.5 rounded-full bg-petroleum-500/20 text-petroleum-300 font-bold">${escapeHTML(t)}</span>`).join(' ');
        const skillBadges = extractHashtags(c.skillsHashtags).map(t => `<span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">${escapeHTML(t)}</span>`).join(' ');

        const detailHTML = `
            <div class="space-y-6">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                        <span class="text-slate-500 block font-medium">Niveau</span>
                        <span class="font-bold text-slate-200">${escapeHTML(c.studyLevel)}</span>
                    </div>
                    <div>
                        <span class="text-slate-500 block font-medium">Heure Arrivée</span>
                        <span class="font-bold text-slate-200">${c.arrivalTime} (${c.delayMinutes > 0 ? '+' + c.delayMinutes + ' min' : 'À l\'heure'})</span>
                    </div>
                    <div>
                        <span class="text-slate-500 block font-medium">Rang au Mérite</span>
                        <span class="font-bold text-petroleum-400">#${rank} sur ${state.candidates.length}</span>
                    </div>
                    <div>
                        <span class="text-slate-500 block font-medium">Mise à jour</span>
                        <span class="font-semibold text-slate-400">${new Date(c.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>

                <div class="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                    <div>
                        <span class="text-slate-400 font-bold block mb-1">🏷️ Hashtags Spécialités :</span>
                        <div class="flex flex-wrap gap-1">${specBadges || '<span class="text-slate-600">Aucun</span>'}</div>
                    </div>
                    <div>
                        <span class="text-slate-400 font-bold block mb-1">⚡ Hashtags Skills & Compétences :</span>
                        <div class="flex flex-wrap gap-1">${skillBadges || '<span class="text-slate-600">Aucun</span>'}</div>
                    </div>
                </div>

                <div class="bg-petroleum-500/10 border border-petroleum-500/30 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-wider text-petroleum-400">Note Générale Finale</h4>
                        <p class="text-xs text-slate-400">Calculée par la commission RH</p>
                    </div>
                    <div class="text-3xl font-black text-white">
                        ${c.finalScore.toFixed(2)} <span class="text-sm font-normal text-slate-400">/ 20</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <span class="text-slate-400 font-medium">1. Note Formulaire</span>
                        <div class="text-xl font-bold text-amber-400">${c.formulaireScore.toFixed(2)} / 20</div>
                    </div>
                    <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <span class="text-slate-400 font-medium">2. Skills & Académique</span>
                        <div class="text-xl font-bold text-blue-400">${c.skillsScore.toFixed(2)} / 20</div>
                    </div>
                    <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                        <span class="text-slate-400 font-medium">3. Situation RH</span>
                        <div class="text-xl font-bold text-emerald-400">${c.rhScore.toFixed(2)} / 20</div>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="text-xs font-bold text-slate-300">Remarques & Observations du Jury</h4>
                    <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                        "${c.remarks ? escapeHTML(c.remarks) : 'Aucune remarque renseignée pour ce candidat.'}"
                    </div>
                </div>
            </div>
        `;

        elements.detailContent.innerHTML = detailHTML;
        elements.detailModal.classList.remove('hidden');
    }

    function openSettingsModal() {
        elements.gasUrlInput.value = state.gasUrl;
        elements.settingsModal.classList.remove('hidden');
    }

    function closeSettingsModal() {
        elements.settingsModal.classList.add('hidden');
    }

    function handleSaveSettings() {
        const newUrl = normalizeGasUrl(elements.gasUrlInput.value);
        state.gasUrl = newUrl;
        localStorage.setItem('petroleum_gas_url', newUrl);

        showToast("URL Google Apps Script enregistrée", "success");
        closeSettingsModal();

        fetchFromGAS();
    }

    async function handleTestGasUrl() {
        const url = normalizeGasUrl(elements.gasUrlInput.value);
        if (!url) {
            showToast("Veuillez saisir une URL avant de tester", "warning");
            return;
        }

        showToast("Test de connexion en cours...", "info");

        try {
            const res = await fetch(url, { method: 'GET', redirect: 'follow' });
            if (res.ok) {
                showToast("Connexion API Google Sheets réussie !", "success");
            } else {
                showToast(`Erreur HTTP: ${res.status}`, "error");
            }
        } catch (e) {
            showToast("Vérification URL WebApp...", "info");
        }
    }

    function handleCopyGasCode() {
        const code = document.querySelector('#settingsModal pre').textContent;
        navigator.clipboard.writeText(code).then(() => {
            showToast("Code Apps Script copié !", "success");
        }).catch(() => {
            showToast("Erreur lors de la copie", "error");
        });
    }

    function handleRefreshFromGAS() {
        fetchFromGAS();
        closeSettingsModal();
        showToast("Données rafraîchies depuis Google Sheets", "info");
    }

    function exportToCSV() {
        if (state.candidates.length === 0) {
            showToast("Aucun candidat à exporter", "warning");
            return;
        }

        const headers = ["Rang", "Nom et Prenom", "Email", "Hashtags Specialite", "Hashtags Skills", "Niveau", "Heure Prevue", "Heure Arrivee", "Retard (min)", "Note Formulaire", "Note Skills", "Note RH", "Note Generale", "Remarques"];
        const sorted = [...state.candidates].sort((a, b) => b.finalScore - a.finalScore);

        const rows = sorted.map((c, index) => [
            index + 1,
            `"${c.fullName.replace(/"/g, '""')}"`,
            `"${c.email}"`,
            `"${(c.specialty || '').replace(/"/g, '""')}"`,
            `"${(c.skillsHashtags || '').replace(/"/g, '""')}"`,
            `"${c.studyLevel}"`,
            `"${c.scheduledTime}"`,
            `"${c.arrivalTime}"`,
            c.delayMinutes,
            c.formulaireScore.toFixed(2),
            c.skillsScore.toFixed(2),
            c.rhScore.toFixed(2),
            c.finalScore.toFixed(2),
            `"${(c.remarks || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Petroleum_Club_Recrutement_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast("Fichier CSV généré", "success");
    }

    function exportToJSON() {
        if (state.candidates.length === 0) {
            showToast("Aucun candidat à exporter", "warning");
            return;
        }

        const sorted = [...state.candidates].sort((a, b) => b.finalScore - a.finalScore);
        const blob = new Blob([JSON.stringify(sorted, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Petroleum_Club_Candidates_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast("Fichier JSON généré", "success");
    }

    function getScoreRatingLabel(score) {
        const val = parseFloat(score);
        if (val >= 16) return "Excellent Profil";
        if (val >= 14) return "Très Bon Profil";
        if (val >= 12) return "Profil Satisfaisant";
        if (val >= 10) return "Profil Moyen";
        return "Profil Insuffisant";
    }

    function showLoading(show) {
        state.isLoading = show;
        elements.loadingState.classList.toggle('hidden', !show);
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');

        let bgBorder = "bg-darkslate-800 border-slate-700 text-slate-200";
        let icon = '<i class="fa-solid fa-circle-info text-blue-400"></i>';

        if (type === 'success') {
            bgBorder = "bg-darkslate-900 border-emerald-500/40 text-emerald-300";
            icon = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
        } else if (type === 'error') {
            bgBorder = "bg-darkslate-900 border-red-500/40 text-red-300";
            icon = '<i class="fa-solid fa-triangle-exclamation text-red-400"></i>';
        } else if (type === 'warning') {
            bgBorder = "bg-darkslate-900 border-amber-500/40 text-amber-300";
            icon = '<i class="fa-solid fa-bell text-amber-400"></i>';
        }

        toast.className = `toast-enter pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl text-xs font-semibold ${bgBorder}`;
        toast.innerHTML = `${icon} <span>${escapeHTML(message)}</span>`;

        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3500);
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
