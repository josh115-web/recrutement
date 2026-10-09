import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileCheck,
  User,
  Sparkles,
  Award,
  Save,
  FileText,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { DEPARTMENTS } from '@/data/pcsMembersData'
import { calculateHRScore, calculateFinalScore, getPerformanceStatus } from '@/lib/scoring'
import { generateHREvaluationAI } from '@/lib/aiAssistant'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import OfficialFichePdf from '@/components/pdf/OfficialFichePdf'
import { HRMetrics, HRDecision, FollowUpSheet, Member } from '@/types'

export default function FollowUpPage() {
  const {
    members,
    saveFollowUpSheet,
    currentMandateYear,
    openAIKey,
    followUpSheets,
  } = useAppStore()

  const activeMembers = members.filter(
    (m) => m.mandateYear === currentMandateYear && m.status === 'active'
  )

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    activeMembers[0]?.id || ''
  )
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-07')

  const selectedMember = members.find((m) => m.id === selectedMemberId)
  const dept = DEPARTMENTS.find((d) => d.id === selectedMember?.departmentId)

  // Metrics state
  const [metrics, setMetrics] = useState<HRMetrics>({
    presence: 95,
    participation: 90,
    deliverables: 90,
    communication: 90,
    initiative: 95,
    facebookActivity: 90,
  })

  const [executionScore, setExecutionScore] = useState<number>(92)
  const [behaviorObservation, setBehaviorObservation] = useState<string>(
    'Membre très appliqué, dynamique et réactif lors des livrables de la semaine.'
  )
  const [hrInsight, setHrInsight] = useState<string>(
    'Poursuit une courbe de progression ascendante. Apporte une réelle plus-value au club.'
  )
  const [hrComment, setHrComment] = useState<string>(
    'Encouragement vif. À maintenir pour le prochain cycle de projets.'
  )
  const [decision, setDecision] = useState<HRDecision>('encouragement')
  const [objectives, setObjectives] = useState<string[]>([
    'Assister à toutes les réunions hebdomadaires du département',
    'Rendre les visuels et rapports 24h avant la deadline',
    'Participer à l\'animation des ateliers pratiques',
  ])

  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [savedSheetId, setSavedSheetId] = useState<string | null>(null)
  const [showPdfModal, setShowPdfModal] = useState(false)

  // Auto scores
  const hrScore = calculateHRScore(metrics)
  const finalScore = calculateFinalScore(hrScore, executionScore)
  const status = getPerformanceStatus(finalScore)

  const handleMetricChange = (key: keyof HRMetrics, val: number) => {
    setMetrics((prev) => ({ ...prev, [key]: Math.min(100, Math.max(0, val)) }))
  }

  const handleTriggerAI = async () => {
    if (!selectedMember || !dept) return
    setIsGeneratingAI(true)
    try {
      const res = await generateHREvaluationAI({
        memberName: selectedMember.fullName,
        departmentName: dept.name,
        speciality: selectedMember.speciality,
        metrics,
        hrScore,
        decision,
        apiKey: openAIKey,
      })
      setHrInsight(res.hrInsight)
      setHrComment(res.hrComment)
      setObjectives(res.objectives)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleSave = () => {
    if (!selectedMember) return
    const sheetId = saveFollowUpSheet({
      memberId: selectedMember.id,
      memberName: selectedMember.fullName,
      departmentId: selectedMember.departmentId,
      month: selectedMonth,
      mandateYear: currentMandateYear,
      metrics,
      hrScore,
      executionScore,
      finalScore,
      behaviorObservation,
      hrInsight,
      hrComment,
      decision,
      nextMonthObjectives: objectives,
      evaluatorId: 'pcs-35',
      evaluatorName: 'BELABBAS Rayane',
    })
    setSavedSheetId(sheetId)
    setShowPdfModal(true)
  }

  const currentSheet = followUpSheets.find((s) => s.id === savedSheetId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold mb-2">
            <FileCheck className="w-4 h-4" /> Générateur Rapide &lt; 5 minutes
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-title text-foreground">
            Fiche de Suivi Mensuelle HR
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Petroleum Club Skikda — Formulaire officiel d'évaluation mensuelle des membres.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleTriggerAI}
            disabled={isGeneratingAI}
            className="gap-2 text-xs border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-bold"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            {isGeneratingAI ? 'IA en cours...' : 'Rédiger avec IA HR'}
          </Button>

          <Button variant="gradient" onClick={handleSave} className="gap-2 font-bold text-xs">
            <Save className="w-4 h-4" /> Sauvegarder & Générer PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Member & Month Selection + Auto Identity Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" /> Sélection du Membre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1.5">
                  Mois de l'évaluation
                </label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800/60"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1.5">
                  Membre du PCS ({activeMembers.length} membres)
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-slate-50 dark:bg-slate-800/60 px-3 text-xs font-medium text-foreground focus:ring-2 focus:ring-primary"
                >
                  {activeMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} — {DEPARTMENTS.find((d) => d.id === m.departmentId)?.shortName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Member Preview Card */}
              {selectedMember && (
                <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedMember.photoUrl}
                      alt={selectedMember.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500 shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-sm font-title text-foreground">{selectedMember.fullName}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500 text-white font-bold inline-block mt-0.5">
                        {dept?.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-1 border-t border-orange-500/10 pt-2">
                    <p><span className="font-semibold text-foreground">Spécialité:</span> {selectedMember.speciality}</p>
                    <p><span className="font-semibold text-foreground">Niveau:</span> {selectedMember.studyLevel}</p>
                    <p><span className="font-semibold text-foreground">Matricule:</span> {selectedMember.studentCardNumber}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scores Summary Live Box */}
          <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-orange-400">
                <Award className="w-5 h-5" /> Scores Calculés en Temps Réel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Note Suivi HR (40%)</span>
                  <p className="text-xl font-extrabold text-orange-400 mt-1">{hrScore}/100</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Note Exécution (60%)</span>
                  <p className="text-xl font-extrabold text-amber-300 mt-1">{executionScore}/100</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-center space-y-1">
                <span className="text-xs font-bold text-orange-300 uppercase tracking-wider block">Score Final Global</span>
                <p className="text-3xl font-black text-white">{finalScore} / 100</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold mt-2 ${
                  finalScore >= 85
                    ? 'bg-emerald-500 text-white'
                    : finalScore >= 70
                    ? 'bg-blue-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  {status === 'excellent' ? 'EXCELLENT' : status === 'stable' ? 'STABLE' : 'A SUIVRE'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Column: Sliders for 6 Criteria & Text Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Criteria Sliders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-orange-500" /> Évaluation des 6 Critères HR (Pondérés)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span>Présence & Assiduité (20%)</span>
                  <span className="text-orange-600 font-black">{metrics.presence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.presence}
                  onChange={(e) => handleMetricChange('presence', Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span>Participation aux Réunions (10%)</span>
                  <span className="text-orange-600 font-black">{metrics.participation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.participation}
                  onChange={(e) => handleMetricChange('participation', Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span>Qualité des Livrables (20%)</span>
                  <span className="text-orange-600 font-black">{metrics.deliverables}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.deliverables}
                  onChange={(e) => handleMetricChange('deliverables', Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span>Communication Interne (10%)</span>
                  <span className="text-orange-600 font-black">{metrics.communication}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.communication}
                  onChange={(e) => handleMetricChange('communication', Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span>Initiative & Proactivité (20%)</span>
                  <span className="text-orange-600 font-black">{metrics.initiative}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.initiative}
                  onChange={(e) => handleMetricChange('initiative', Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span>Activité Facebook & Média (20%)</span>
                  <span className="text-orange-600 font-black">{metrics.facebookActivity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.facebookActivity}
                  onChange={(e) => handleMetricChange('facebookActivity', Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="md:col-span-2 pt-2 border-t border-border">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span>Note d'Exécution donnée par le Chef de Département (0-100)</span>
                  <span className="text-amber-600 font-black">{executionScore}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={executionScore}
                  onChange={(e) => setExecutionScore(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Observations & AI HR Insights */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Analyse HR & Remarques
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTriggerAI}
                className="text-xs text-amber-600 gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Régénérer via IA
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Observation sur le Comportement
                </label>
                <textarea
                  rows={2}
                  value={behaviorObservation}
                  onChange={(e) => setBehaviorObservation(e.target.value)}
                  className="w-full rounded-xl border border-input bg-slate-50 dark:bg-slate-800/60 p-3 text-xs font-medium focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Analyse Synthétique HR (Générée)
                </label>
                <textarea
                  rows={2}
                  value={hrInsight}
                  onChange={(e) => setHrInsight(e.target.value)}
                  className="w-full rounded-xl border border-input bg-slate-50 dark:bg-slate-800/60 p-3 text-xs font-medium focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">
                    Décision HR
                  </label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value as HRDecision)}
                    className="w-full h-10 rounded-xl border border-input bg-slate-50 dark:bg-slate-800/60 px-3 text-xs font-medium text-foreground"
                  >
                    <option value="encouragement">Encouragement & Promotion</option>
                    <option value="maintain">Maintien de Statut</option>
                    <option value="improvement_plan">Plan d'Amélioration</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">
                    Commentaire Officiel
                  </label>
                  <input
                    type="text"
                    value={hrComment}
                    onChange={(e) => setHrComment(e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-slate-50 dark:bg-slate-800/60 px-3 text-xs font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PDF Modal Trigger */}
      {showPdfModal && currentSheet && selectedMember && (
        <OfficialFichePdf
          sheet={currentSheet}
          member={selectedMember}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </motion.div>
  )
}
