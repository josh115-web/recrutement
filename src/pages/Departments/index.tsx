import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, Flame, Award, Edit3, Check } from 'lucide-react'
import { useAppStore } from '@/store'
import { DEPARTMENTS } from '@/data/pcsMembersData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DepartmentId } from '@/types'

export default function DepartmentsPage() {
  const { members, currentMandateYear, updateExecutionScore } = useAppStore()
  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentId>('hr')
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [tempScore, setTempScore] = useState<number>(90)

  const activeMembers = members.filter(
    (m) => m.mandateYear === currentMandateYear && m.status === 'active'
  )

  const currentDept = DEPARTMENTS.find((d) => d.id === selectedDeptId) || DEPARTMENTS[0]
  const deptMembers = activeMembers.filter((m) => m.departmentId === selectedDeptId)

  const handleSaveScore = (memberId: string) => {
    updateExecutionScore(memberId, '2026-07', tempScore)
    setEditingMemberId(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header Banner */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold mb-2">
            <Building2 className="w-4 h-4" /> 5 Départements Spécialisés
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-title text-foreground">
            Gestion des Départements & Note d'Exécution
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Chaque chef de département attribue mensuellement la note d'exécution (0-100) à ses membres.
          </p>
        </div>
      </div>

      {/* Department Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-4">
        {DEPARTMENTS.map((d) => (
          <Button
            key={d.id}
            variant={selectedDeptId === d.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedDeptId(d.id)}
            className="text-xs font-bold rounded-xl gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name} ({d.shortName})
          </Button>
        ))}
      </div>

      {/* Selected Department Manager Header */}
      <Card className="border-orange-200 dark:border-orange-950">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: currentDept.color }}>
              {currentDept.name} ({currentDept.shortName})
            </span>
            <h2 className="text-xl font-extrabold font-title text-foreground">Chef: {currentDept.managerName}</h2>
            <p className="text-xs text-muted-foreground max-w-xl">{currentDept.description}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-border text-center shrink-0">
            <span className="text-xs text-muted-foreground font-semibold block">Effectif Actif</span>
            <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{deptMembers.length}</span>
            <span className="text-[10px] text-muted-foreground block">Membres</span>
          </div>
        </CardContent>
      </Card>

      {/* Members Execution Score List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" /> Membres de {currentDept.shortName} — Attribution des Notes d'Exécution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deptMembers.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.photoUrl}
                    alt={m.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-foreground">{m.fullName}</h4>
                      {m.isManager && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500 text-white font-bold">
                          Chef
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{m.currentPosition} | {m.speciality}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {editingMemberId === m.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={tempScore}
                        onChange={(e) => setTempScore(Number(e.target.value))}
                        className="w-20 h-8 text-xs font-bold text-center"
                      />
                      <Button size="sm" onClick={() => handleSaveScore(m.id)} className="h-8 px-2 text-xs">
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          {m.executionScore}/100
                        </span>
                        <span className="text-[10px] text-muted-foreground block">Note Exécution</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingMemberId(m.id)
                          setTempScore(m.executionScore)
                        }}
                        className="h-8 w-8"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
