import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  UserCheck,
  Eye,
  FileText,
  Building2,
  ChevronRight,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { DEPARTMENTS, MANDATES } from '@/data/pcsMembersData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MemberStatus, DepartmentId } from '@/types'
import * as XLSX from 'xlsx'

export default function MembersPage() {
  const { members, currentMandateYear, setMandateYear } = useAppStore()

  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.speciality.toLowerCase().includes(search.toLowerCase()) ||
      (m.studentCardNumber && m.studentCardNumber.includes(search))

    const matchesDept = selectedDept === 'all' || m.departmentId === selectedDept
    const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus
    const matchesMandate = m.mandateYear === currentMandateYear

    return matchesSearch && matchesDept && matchesStatus && matchesMandate
  })

  const handleExportExcel = () => {
    const dataToExport = filteredMembers.map((m) => ({
      ID: m.id,
      Nom_Complet: m.fullName,
      Departement: m.departmentId,
      Poste: m.currentPosition,
      Specialite: m.speciality,
      Niveau: m.studyLevel,
      Email: m.email,
      Telephone: m.phone,
      Statut: m.status,
      Score_Final: m.finalScore,
      Mandat: m.mandateYear,
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PCS_Membres')
    XLSX.writeFile(workbook, `PCS_Membres_Database_${currentMandateYear}.xlsx`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header Banner & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold mb-2">
            <Users className="w-4 h-4" /> Base Officielle ({filteredMembers.length} membres)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-title text-foreground">
            Base des Membres PCS — Mandat {currentMandateYear}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gestion centralisée de tous les membres du Petroleum Club Skikda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2 text-xs font-bold">
            <Download className="w-4 h-4 text-emerald-500" /> Exporter Excel
          </Button>
          <Link to="/followup">
            <Button variant="gradient" size="sm" className="gap-2 text-xs font-bold">
              <Plus className="w-4 h-4" /> Nouveau Suivi
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un membre par nom, email, spécialité..."
              className="pl-9 h-10 text-xs bg-slate-50 dark:bg-slate-800/60"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full h-10 rounded-xl border border-input bg-slate-50 dark:bg-slate-800/60 px-3 text-xs font-medium text-foreground"
            >
              <option value="all">Tous les Départements</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.shortName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 rounded-xl border border-input bg-slate-50 dark:bg-slate-800/60 px-3 text-xs font-medium text-foreground"
            >
              <option value="all">Tous les Statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Members Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((m) => {
          const dept = DEPARTMENTS.find((d) => d.id === m.departmentId)
          return (
            <Card key={m.id} className="hover:shadow-card-hover transition-all border-border group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.photoUrl}
                      alt={m.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500 shadow-sm"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm font-title text-foreground group-hover:text-orange-500 transition-colors">
                        {m.fullName}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">{m.currentPosition}</p>
                      {m.isManager && (
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black bg-amber-500 text-white mt-1">
                          Chef de Département
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: dept?.color }}
                  >
                    {dept?.shortName}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-muted-foreground border-t border-border pt-3">
                  <p><span className="font-semibold text-foreground">Spécialité:</span> {m.speciality}</p>
                  <p><span className="font-semibold text-foreground">Niveau:</span> {m.studyLevel}</p>
                  <p><span className="font-semibold text-foreground">Email:</span> {m.email}</p>
                  <p><span className="font-semibold text-foreground">Téléphone:</span> {m.phone}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Score Absolu</span>
                    <span className="text-sm font-black text-orange-600 dark:text-orange-400">{m.finalScore}/100</span>
                  </div>

                  <Link to={`/members/${m.id}`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <Eye className="w-3.5 h-3.5" /> Voir Profil <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </motion.div>
  )
}
