import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  FileCheck,
  Award,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  BarChart2,
  Calendar,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { DEPARTMENTS } from '@/data/pcsMembersData'
import { translations, isRTL } from '@/lib/i18n'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import OfficialFichePdf from '@/components/pdf/OfficialFichePdf'
import { FollowUpSheet, Member } from '@/types'

export default function DashboardPage() {
  const { members, followUpSheets, motmRecords, currentMandateYear, currentLanguage } = useAppStore()
  const t = translations[currentLanguage] || translations.fr
  const rtl = isRTL(currentLanguage)

  const [previewSheet, setPreviewSheet] = useState<{ sheet: FollowUpSheet; member: Member } | null>(null)

  // Filter members by current mandate
  const activeMembers = members.filter((m) => m.mandateYear === currentMandateYear && m.status === 'active')
  const totalCount = activeMembers.length

  const avgHR = Math.round(
    activeMembers.reduce((acc, m) => acc + (m.followUpScore || 0), 0) / (totalCount || 1)
  )
  const avgExec = Math.round(
    activeMembers.reduce((acc, m) => acc + (m.executionScore || 0), 0) / (totalCount || 1)
  )

  const currentMonth = '2026-07'
  const currentMotmList = motmRecords.filter(
    (r) => r.mandateYear === currentMandateYear && r.month === currentMonth
  )

  const stats = [
    { title: t.totalMembers, value: totalCount, icon: Users, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/40' },
    { title: t.navDepartments, value: 5, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { title: 'Fiches de Suivi ce mois', value: followUpSheets.length, icon: FileCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { title: t.avgHRScore, value: `${avgHR}/100`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Top Banner with PCS Logo & Quick Actions */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Mandat Officiel {currentMandateYear}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-title tracking-tight text-white">
              Petroleum Club Skikda — HR Platform
            </h1>
            <p className="text-sm font-serif italic text-orange-400">
              "{t.slogan}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/followup">
              <Button variant="gradient" className="flex items-center gap-2 font-bold">
                <PlusCircle className="w-4 h-4" /> Nouveau Suivi (5 min)
              </Button>
            </Link>
            <Link to="/motm">
              <Button variant="secondary" className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Voir Tableau d'Honneur
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="hover:shadow-card-hover transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-extrabold font-title mt-1 text-foreground">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Member of the Month Podium Highlight */}
      <Card className="border-orange-200 dark:border-orange-950 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Award className="w-6 h-6 text-amber-500" />
              Member of the Month — {currentMonth} ({currentMandateYear})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Calculé automatiquement à partir des évaluations HR (40%) et des scores d'exécution des chefs (60%). Chefs de département exclus.
            </p>
          </div>
          <Link to="/motm">
            <Button variant="ghost" size="sm" className="text-xs text-orange-600 gap-1">
              Voir tout <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            {currentMotmList.map((motm) => {
              const dept = DEPARTMENTS.find((d) => d.id === motm.departmentId)
              return (
                <div
                  key={motm.id}
                  className="bg-card border border-border p-4 rounded-2xl flex flex-col items-center text-center space-y-3 relative hover:scale-105 transition-transform shadow-sm"
                >
                  <span className="absolute top-3 right-3 text-lg">🥇</span>
                  <img
                    src={motm.photoUrl}
                    alt={motm.memberName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-xs font-title text-foreground">{motm.memberName}</h4>
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold text-white mt-1"
                      style={{ backgroundColor: dept?.color }}
                    >
                      {dept?.shortName}
                    </span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-border text-center">
                    <span className="text-[10px] text-muted-foreground block">Score Final</span>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">{motm.finalScore}/100</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Grid section: Department Overview & Recent Follow-up Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-500" /> Départements (PCS)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEPARTMENTS.map((d) => {
              const deptMembers = activeMembers.filter((m) => m.departmentId === d.id)
              return (
                <div
                  key={d.id}
                  className="p-3.5 rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-10 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{d.name}</h4>
                      <p className="text-[11px] text-muted-foreground">Chef: {d.managerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-foreground">{deptMembers.length}</span>
                    <span className="text-[10px] text-muted-foreground block">Membres</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Follow-Up Sheets with PDF Preview Button */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-500" /> Dernières Fiches de Suivi HR
            </CardTitle>
            <Link to="/followup">
              <Button variant="ghost" size="sm" className="text-xs text-orange-500">
                Créer Suivi
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {followUpSheets.slice(0, 5).map((sheet) => {
                const member = members.find((m) => m.id === sheet.memberId)
                if (!member) return null
                return (
                  <div
                    key={sheet.id}
                    className="p-3.5 rounded-2xl border border-border bg-card flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.photoUrl}
                        alt={member.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-foreground">{member.fullName}</h4>
                        <p className="text-[10px] text-muted-foreground">Mois: {sheet.month} | Évaluateur: {sheet.evaluatorName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-black text-orange-600 dark:text-orange-400">
                          {sheet.finalScore}/100
                        </span>
                        <span className="text-[10px] text-muted-foreground block uppercase">Score Final</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewSheet({ sheet, member })}
                        className="text-xs gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> PDF
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PDF Modal Previewer */}
      {previewSheet && (
        <OfficialFichePdf
          sheet={previewSheet.sheet}
          member={previewSheet.member}
          onClose={() => setPreviewSheet(null)}
        />
      )}
    </motion.div>
  )
}
