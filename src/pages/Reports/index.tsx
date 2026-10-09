import { motion } from 'framer-motion'
import { BarChart3, Download, TrendingUp, Users, Award, ShieldCheck, FileCheck } from 'lucide-react'
import { useAppStore } from '@/store'
import { DEPARTMENTS } from '@/data/pcsMembersData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'

export default function ReportsPage() {
  const { members, followUpSheets, currentMandateYear } = useAppStore()

  const activeMembers = members.filter((m) => m.mandateYear === currentMandateYear && m.status === 'active')

  const handleExportFullReport = () => {
    const reportData = activeMembers.map((m) => {
      const sheet = followUpSheets.find((s) => s.memberId === m.id)
      return {
        Matricule: m.id,
        Nom_Complet: m.fullName,
        Departement: DEPARTMENTS.find((d) => d.id === m.departmentId)?.name,
        Role: m.currentPosition,
        Presence: sheet?.metrics.presence || 90,
        Participation: sheet?.metrics.participation || 90,
        Livrables: sheet?.metrics.deliverables || 90,
        Communication: sheet?.metrics.communication || 90,
        Initiative: sheet?.metrics.initiative || 90,
        Facebook_Media: sheet?.metrics.facebookActivity || 90,
        Note_HR: m.followUpScore,
        Note_Execution: m.executionScore,
        Score_Final: m.finalScore,
        Statut: m.overallStatus,
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(reportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport_HR_PCS')
    XLSX.writeFile(workbook, `Rapport_General_PCS_${currentMandateYear}.xlsx`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold mb-2">
            <BarChart3 className="w-4 h-4" /> Rapport Général & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-title text-foreground">
            Rapports & Statistiques — Mandat {currentMandateYear}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Générez et exportez des rapports synthétiques complets pour le bureau exécutif.
          </p>
        </div>

        <Button variant="gradient" onClick={handleExportFullReport} className="gap-2 font-bold text-xs">
          <Download className="w-4 h-4" /> Exporter Rapport Synthétique Excel
        </Button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" /> Répartition par Département
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEPARTMENTS.map((d) => {
              const count = activeMembers.filter((m) => m.departmentId === d.id).length
              const pct = Math.round((count / (activeMembers.length || 1)) * 100)
              return (
                <div key={d.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{d.shortName}</span>
                    <span className="text-muted-foreground">{count} membres ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Top Performeurs du PCS (Score Absolu)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...activeMembers]
                .sort((a, b) => b.finalScore - a.finalScore)
                .slice(0, 5)
                .map((m, idx) => {
                  const dept = DEPARTMENTS.find((d) => d.id === m.departmentId)
                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 font-extrabold text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <img
                          src={m.photoUrl}
                          alt={m.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-foreground">{m.fullName}</h4>
                          <p className="text-[10px] text-muted-foreground">{dept?.name} ({dept?.shortName})</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-600">{m.finalScore}/100</span>
                        <span className="text-[10px] text-muted-foreground block">Score Final</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
