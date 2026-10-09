import { motion } from 'framer-motion'
import { Info, Flame, Award, ShieldCheck, Target, Heart, Eye, History, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '@/store'
import { CLUB_INFO, PRESIDENTS_HISTORY, MANDATES } from '@/data/pcsMembersData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function AboutPCSPage() {
  const { currentMandateYear } = useAppStore()

  const values = [
    { title: 'Excellence Ingénierie', desc: 'Rigueur académique et technique inspirée du secteur pétrolier et pétrochimique.', icon: Flame },
    { title: 'Leadership Etudiant', desc: 'Formation de leaders responsables d\'aujourd\'hui et de demain.', icon: Target },
    { title: 'Collaboration & Esprit d\'Équipe', desc: 'Solidarité inter-départements et travail méthodique étape par étape.', icon: Heart },
    { title: 'Innovation Digitale', desc: 'Digitalisation totale des flux et création d\'outils modernes SaaS.', icon: ShieldCheck },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Hero Banner with Official Logo & Slogan */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <Info className="w-3.5 h-3.5" /> À Propos du Club Officiel
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-title tracking-tight text-white">
            {CLUB_INFO.name}
          </h1>
          <p className="text-2xl font-serif italic text-orange-400 font-medium">
            "{CLUB_INFO.slogan}"
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Fondé à l'Université 20 Août 1955 de Skikda, le Petroleum Club Skikda (PCS) regroupe les étudiants et futurs ingénieurs passionnés par le génie des procédés, le génie pétrolier, la raffinage et la pétrochimie.
          </p>
        </div>
      </div>

      {/* Mission, Vision & Slogan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-orange-200 dark:border-orange-950">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-orange-600">
              <Target className="w-5 h-5" /> Notre Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Promouvoir la culture scientifique et l'excellence technique dans le domaine pétrolier, développer les compétences managériales et préparer les étudiants aux exigences industrielles.
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-950">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-amber-600">
              <Eye className="w-5 h-5" /> Notre Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Devenir le club scientifique de référence en Algérie dans l'ingénierie énergétique et la gestion moderne des ressources humaines étudiantes.
          </CardContent>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-950">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-emerald-600">
              <Award className="w-5 h-5" /> Notre Slogan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-serif italic font-bold text-foreground">
              "Step by Step We'll Make It Up"
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Une philosophie pragmatique prônant la constance, la persévérance et le progrès continu dans chaque projet du club.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Values Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-orange-500" /> Nos Valeurs Fondamentales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <div key={i} className="p-4 rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs font-title text-foreground">{v.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Historique des Présidents et Bureaux */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" /> Historique des Présidents et Bureaux (PCS)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {PRESIDENTS_HISTORY.map((p) => {
              const isCurrent = p.mandateYear === currentMandateYear
              return (
                <div
                  key={p.mandateYear}
                  className={`p-6 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-orange-500 bg-orange-500/5 shadow-md'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.photoUrl}
                        alt={p.presidentName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base font-title text-foreground">{p.presidentName}</h3>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500 text-white font-bold">
                              Mandat Actif
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-orange-600 font-semibold">Président du PCS — Mandat {p.mandateYear}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Vice-Présidente: {p.vicePresidentName}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 md:max-w-md">
                      <p className="text-xs font-bold text-foreground">Réalisations Clés:</p>
                      <ul className="space-y-1">
                        {p.keyAchievements.map((ach, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
