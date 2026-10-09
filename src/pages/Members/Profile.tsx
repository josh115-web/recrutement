import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, MapPin, Award, FileText, ArrowLeft, PlusCircle, CheckCircle2, Shield } from 'lucide-react'
import { useAppStore } from '@/store'
import { DEPARTMENTS } from '@/data/pcsMembersData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import OfficialFichePdf from '@/components/pdf/OfficialFichePdf'
import { FollowUpSheet } from '@/types'

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { members, followUpSheets } = useAppStore()

  const member = members.find((m) => m.id === id) || members[0]
  const dept = DEPARTMENTS.find((d) => d.id === member?.departmentId)

  const memberSheets = followUpSheets.filter((s) => s.memberId === member?.id)
  const [selectedSheet, setSelectedSheet] = useState<FollowUpSheet | null>(null)

  if (!member) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Back Button */}
      <Link to="/members">
        <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Retour à la base des membres
        </Button>
      </Link>

      {/* Member Hero Profile Header */}
      <Card className="overflow-hidden border-orange-200 dark:border-orange-950">
        <div className="h-32 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 relative" />
        <CardContent className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-14 mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <img
                src={member.photoUrl}
                alt={member.fullName}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-card shadow-xl"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl font-black font-title text-foreground">{member.fullName}</h1>
                  {member.isManager && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500 text-white font-bold">
                      Chef
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  {member.currentPosition} — {dept?.name} ({dept?.shortName})
                </p>
                <p className="text-xs text-muted-foreground">{member.speciality} | {member.studyLevel}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/followup">
                <Button variant="gradient" size="sm" className="gap-2 font-bold text-xs">
                  <PlusCircle className="w-4 h-4" /> Nouveau Suivi
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border pt-4 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px]">Email Officiel</span>
              <span className="font-semibold text-foreground truncate block">{member.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Téléphone</span>
              <span className="font-semibold text-foreground">{member.phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Carte Etudiante</span>
              <span className="font-semibold text-foreground">{member.studentCardNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Mandat Actif</span>
              <span className="font-bold text-orange-600">{member.mandateYear}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Historical Performance & PDF Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Aggregated Scores */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" /> Synthèse des Performances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center space-y-1">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Score Absolue (Global)</span>
              <p className="text-3xl font-black text-foreground">{member.finalScore} / 100</p>
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                EXCELLENT
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-muted-foreground">Note Suivi HR</span>
                <span className="font-bold text-orange-600">{member.followUpScore}/100</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-muted-foreground">Note Exécution Chef</span>
                <span className="font-bold text-amber-600">{member.executionScore}/100</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-muted-foreground">Taux de Présence</span>
                <span className="font-bold text-emerald-600">{member.attendanceRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: PDF History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" /> Historique des Fiches de Suivi PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {memberSheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground">Fiche de Suivi — Mois {sheet.month}</h4>
                      <p className="text-[10px] text-muted-foreground">Évaluateur: {sheet.evaluatorName} ({sheet.mandateYear})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-orange-600">{sheet.finalScore}/100</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSheet(sheet)}
                      className="text-xs gap-1"
                    >
                      Voir PDF Officiel
                    </Button>
                  </div>
                </div>
              ))}

              {memberSheets.length === 0 && (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  Aucune fiche de suivi générée pour le moment.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PDF Modal */}
      {selectedSheet && (
        <OfficialFichePdf
          sheet={selectedSheet}
          member={member}
          onClose={() => setSelectedSheet(null)}
        />
      )}
    </motion.div>
  )
}
