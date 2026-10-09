import { Language } from '@/types'

export interface TranslationDictionary {
  appName: string;
  slogan: string;
  university: string;
  // Navigation
  navDashboard: string;
  navMembers: string;
  navFollowUp: string;
  navMOTM: string;
  navDepartments: string;
  navAbout: string;
  navReports: string;
  navSettings: string;
  // Roles
  roleAdmin: string;
  roleHR: string;
  roleManager: string;
  roleMember: string;
  // Dashboard & Common
  totalMembers: string;
  activeMandate: string;
  avgHRScore: string;
  avgExecScore: string;
  motmTitle: string;
  quickActions: string;
  createFollowUp: string;
  searchPlaceholder: string;
  filterDepartment: string;
  filterStatus: string;
  filterMandate: string;
  exportPdf: string;
  exportExcel: string;
  importExcel: string;
  // Follow Up Sheet
  ficheDeSuivi: string;
  presenceScore: string;
  participationScore: string;
  deliverablesScore: string;
  communicationScore: string;
  initiativeScore: string;
  facebookActivityScore: string;
  hrInsight: string;
  hrComment: string;
  decision: string;
  objectivesNextMonth: string;
  generateWithAI: string;
  // Statuses
  excellent: string;
  stable: string;
  needsFollowup: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  fr: {
    appName: 'Petroleum Club Skikda',
    slogan: "Step by Step We'll Make It Up",
    university: 'Université 20 Août 1955 - Skikda',
    navDashboard: 'Tableau de bord',
    navMembers: 'Base des Membres',
    navFollowUp: 'Fiche de Suivi HR',
    navMOTM: 'Member of the Month',
    navDepartments: 'Départements',
    navAbout: 'À propos de PCS',
    navReports: 'Rapports & Statistiques',
    navSettings: 'Paramètres',
    roleAdmin: 'Administrateur',
    roleHR: 'Membre HR',
    roleManager: 'Chef de Département',
    roleMember: 'Membre (Lecture)',
    totalMembers: 'Total Membres Actifs',
    activeMandate: 'Mandat Actif',
    avgHRScore: 'Moyenne Score HR',
    avgExecScore: 'Moyenne Exécution',
    motmTitle: 'Tableau d\'Honneur - Membre du Mois',
    quickActions: 'Actions Rapides',
    createFollowUp: 'Nouveau Suivi en 5 min',
    searchPlaceholder: 'Rechercher un membre par nom, matricule...',
    filterDepartment: 'Tous les Départements',
    filterStatus: 'Tous les Statuts',
    filterMandate: 'Année du Mandat',
    exportPdf: 'Exporter PDF Officiel',
    exportExcel: 'Exporter Excel',
    importExcel: 'Importer Base Excel',
    ficheDeSuivi: 'Fiche de Suivi Mensuelle PCS',
    presenceScore: 'Présence & Assiduité (20%)',
    participationScore: 'Participation aux Réunions (10%)',
    deliverablesScore: 'Qualité des Livrables (20%)',
    communicationScore: 'Communication Interne (10%)',
    initiativeScore: 'Esprit d\'Initiative (20%)',
    facebookActivityScore: 'Activité Facebook & Média (20%)',
    hrInsight: 'Analyse Synthétique HR',
    hrComment: 'Recommandations & Observations',
    decision: 'Décision HR',
    objectivesNextMonth: 'Objectifs du mois prochain',
    generateWithAI: 'Générer avec l\'IA HR',
    excellent: 'Excellent',
    stable: 'Stable',
    needsFollowup: 'A Suivre',
  },
  en: {
    appName: 'Petroleum Club Skikda',
    slogan: "Step by Step We'll Make It Up",
    university: '20 August 1955 University - Skikda',
    navDashboard: 'Dashboard',
    navMembers: 'Members Database',
    navFollowUp: 'HR Follow-up Sheet',
    navMOTM: 'Member of the Month',
    navDepartments: 'Departments',
    navAbout: 'About PCS',
    navReports: 'Reports & Analytics',
    navSettings: 'Settings',
    roleAdmin: 'Administrator',
    roleHR: 'HR Member',
    roleManager: 'Department Manager',
    roleMember: 'Member (Read-only)',
    totalMembers: 'Total Active Members',
    activeMandate: 'Active Mandate',
    avgHRScore: 'Average HR Score',
    avgExecScore: 'Average Execution',
    motmTitle: 'Honor Roll - Member of the Month',
    quickActions: 'Quick Actions',
    createFollowUp: 'New Follow-up in 5 mins',
    searchPlaceholder: 'Search member by name, ID...',
    filterDepartment: 'All Departments',
    filterStatus: 'All Statuses',
    filterMandate: 'Mandate Year',
    exportPdf: 'Export Official PDF',
    exportExcel: 'Export Excel',
    importExcel: 'Import Excel DB',
    ficheDeSuivi: 'PCS Monthly Follow-up Sheet',
    presenceScore: 'Presence & Attendance (20%)',
    participationScore: 'Meeting Participation (10%)',
    deliverablesScore: 'Deliverables Quality (20%)',
    communicationScore: 'Internal Communication (10%)',
    initiativeScore: 'Proactivity & Initiative (20%)',
    facebookActivityScore: 'Facebook & Media Engagement (20%)',
    hrInsight: 'HR Analytical Insight',
    hrComment: 'HR Observations & Feedback',
    decision: 'HR Decision',
    objectivesNextMonth: 'Next Month Objectives',
    generateWithAI: 'Generate with HR AI',
    excellent: 'Excellent',
    stable: 'Stable',
    needsFollowup: 'Needs Follow-up',
  },
  ar: {
    appName: 'نادي البترول سكيكدة',
    slogan: 'خطوة بخطوة سنصل إلى القمة',
    university: 'جامعة 20 أوت 1955 - سكيكدة',
    navDashboard: 'لوحة التحكم',
    navMembers: 'قاعدة الأعضاء',
    navFollowUp: 'استمارة المتابعة',
    navMOTM: 'عضو الشهر',
    navDepartments: 'الأقسام',
    navAbout: 'عن النادي',
    navReports: 'التقارير والإحصائيات',
    navSettings: 'الإعدادات',
    roleAdmin: 'مسؤول النظام',
    roleHR: 'عضو الموارد البشرية',
    roleManager: 'رئيس قسم',
    roleMember: 'عضو (قراءة فقط)',
    totalMembers: 'إجمالي الأعضاء النشطين',
    activeMandate: 'العهدة الحالية',
    avgHRScore: 'معدل تقييم HR',
    avgExecScore: 'معدل التنفيذ',
    motmTitle: 'لوحة الشرف - عضو الشهر',
    quickActions: 'إجراءات سريعة',
    createFollowUp: 'إنشاء متابعة في 5 دقائق',
    searchPlaceholder: 'ابحث عن عضو بالاسم أو الرقم...',
    filterDepartment: 'جميع الأقسام',
    filterStatus: 'جميع الحالات',
    filterMandate: 'سنة العهدة',
    exportPdf: 'تصدير PDF رسمي',
    exportExcel: 'تصدير Excel',
    importExcel: 'استيراد قاعدة البيانات',
    ficheDeSuivi: 'بطاقة المتابعة الشهرية PCS',
    presenceScore: 'الاحظور والانضباط (20%)',
    participationScore: 'المشاركة في الاجتماعات (10%)',
    deliverablesScore: 'جودة المهام والنتائج (20%)',
    communicationScore: 'التواصل الداخلي (10%)',
    initiativeScore: 'المبادرة والابتكار (20%)',
    facebookActivityScore: 'التفاعل والتواصل الإعلامي (20%)',
    hrInsight: 'تحليل الموارد البشرية',
    hrComment: 'ملاحظات وتوصيات HR',
    decision: 'قرار الموارد البشرية',
    objectivesNextMonth: 'أهداف الشهر القادم',
    generateWithAI: 'توليد بالذكاء الاصطناعي',
    excellent: 'ممتاز',
    stable: 'مستقر',
    needsFollowup: 'يحتاج متابعة',
  },
}

export function isRTL(lang: Language): boolean {
  return lang === 'ar'
}
