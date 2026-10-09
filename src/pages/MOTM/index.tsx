import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Trophy, Star, TrendingUp, Sparkles, Filter, Calendar } from 'lucide-react'
import { useAppStore } from '@/store'
import { DEPARTMENTS, MANDATES } from '@/data/pcsMembersData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MOTMPage() {
  const { motmRecords, currentMandateYear, setMandateYear } = useAppStore()
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-07')

  const filteredMOTM = motmRecords.filter(
    (r) => r.mandateYear === currentMandateYear && r.month === selectedMonth
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Top Trophy Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-8 shadow-2xl border border-amber-400/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-amber-200 text-xs font-extrabold border border-white/20">
              <Trophy className="w-4 h-4 text-amber-300" /> Tableau d'Honneur PCS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-title tracking-tight text-white">
              Member of the Month (MOTM)
            </h1>
            <p className="text-sm text-amber-100 font-medium">
              Calcul automatique par algorithme HR (40% Suivi HR + 60% Note d'Exécution Chef). Chefs de département systématiquement exclus de la compétition.
            </p>
          </div>

          {/* Mandate Filter Selector */}
          <div className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-2xl border border-white/20 backdrop-blur">
            <Calendar className="w-4 h-4 text-amber-300 ml-2" />
            <select
              value={currentMandateYear}
              onChange={(e) => setMandateYear(e.target.value)}
              className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer pr-2"
            >
              {MANDATES.map((m) => (
                <option key={m.year} value={m.year} className="text-slate-900">
                  Mandat {m.year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Month Picker Tab Bar */}
      <div className="flex items-center gap-2 border-b border-border pb-4 overflow-x-auto">
        {['2026-07', '2026-06', '2026-05', '2026-04'].map((m) => (
          <Button
            key={m}
            variant={selectedMonth === m ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedMonth(m)}
            className="text-xs font-bold rounded-xl"
          >
            Mois {m}
          </Button>
        ))}
      </div>

      {/* 5 Department Winners Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold font-title text-foreground flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Gagnants par Département — {selectedMonth}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DEPARTMENTS.map((dept) => {
            const winner = filteredMOTM.find((r) => r.departmentId === dept.id)
            return (
              <Card
                key={dept.id}
                className="relative overflow-hidden border-orange-200 dark:border-orange-950 hover:shadow-card-hover transition-all text-center group"
              >
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: dept.color }}
                />
                <CardContent className="p-5 space-y-3">
                  <span className="absolute top-4 right-4 text-xl">🏆</span>
                  <div className="relative mx-auto w-20 h-20">
                    <img
                      src={winner?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={winner?.memberName || 'Winner'}
                      className="w-full h-full rounded-2xl object-cover border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white mb-1"
                      style={{ backgroundColor: dept.color }}
                    >
                      {dept.shortName}
                    </span>
                    <h3 className="font-extrabold text-xs font-title text-foreground truncate">
                      {winner?.memberName || 'En attente'}
                    </h3>
                    <p className="text-[10px] text-muted-foreground truncate">{winner?.speciality || dept.name}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-border space-y-1">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Score Final</span>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                      {winner ? `${winner.finalScore}/100` : 'N/A'}
                    </span>
                  </div>

                  <div className="px-2 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 truncate block">
                      {winner?.badgeTitle || 'Membre Émérite'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Tableau d'Honneur Historique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" /> Archives du Tableau d'Honneur PCS ({currentMandateYear})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMOTM.map((rec) => {
              const dept = DEPARTMENTS.find((d) => d.id === rec.departmentId)
              return (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={rec.photoUrl}
                      alt={rec.memberName}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-400"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">{rec.memberName}</h4>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: dept?.color }}
                        >
                          {dept?.shortName}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.badgeTitle} — {rec.speciality}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">{rec.finalScore}/100</span>
                    <span className="text-[10px] text-muted-foreground block">Mois {rec.month}</span>
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
