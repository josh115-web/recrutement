import { useRef } from 'react'
import { Printer, Download, X, Award, CheckCircle2, AlertTriangle, Star } from 'lucide-react'
import { FollowUpSheet, Member } from '@/types'
import { Button } from '@/components/ui/button'
import { DEPARTMENTS, CLUB_INFO } from '@/data/pcsMembersData'

interface OfficialFichePdfProps {
  sheet: FollowUpSheet;
  member: Member;
  onClose: () => void;
}

export default function OfficialFichePdf({ sheet, member, onClose }: OfficialFichePdfProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const dept = DEPARTMENTS.find((d) => d.id === member.departmentId)

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')
    if (!windowPrint) return

    windowPrint.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fiche_De_Suivi_PCS_${member.lastName}_${sheet.month}.pdf</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: 'Inter', sans-serif; background: white; color: #0f172a; }
          </style>
        </head>
        <body onload="window.print();window.close();">
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    windowPrint.document.close()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Controls Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-bold text-white font-title">
              Aperçu Fiche de Suivi Officielle — {member.fullName} ({sheet.month})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="gradient"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Imprimer / Imprimer PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* PDF Document Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50 flex justify-center">
          <div
            ref={printRef}
            className="w-full max-w-[210mm] bg-white text-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 text-xs leading-relaxed space-y-6"
          >
            {/* Header section with Logo & Slogan */}
            <div className="flex items-center justify-between border-b-2 border-orange-500 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center font-black text-white text-xl">
                  PCS
                </div>
                <div>
                  <h1 className="text-xl font-extrabold font-title tracking-tight text-slate-900 uppercase">
                    PETROLEUM CLUB SKIKDA
                  </h1>
                  <p className="text-[11px] font-serif italic text-orange-600 font-bold">
                    "{CLUB_INFO.slogan}"
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">{CLUB_INFO.university}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <span className="inline-block px-3 py-1 bg-slate-900 text-orange-400 font-bold text-[10px] uppercase tracking-wider rounded-md">
                  FICHE DE SUIVI MENSUELLE
                </span>
                <p className="text-[11px] font-bold text-slate-700">Mois: {sheet.month}</p>
                <p className="text-[10px] text-slate-500">Mandat: {sheet.mandateYear}</p>
              </div>
            </div>

            {/* Member Identity Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-4 gap-4 items-center">
              <div className="col-span-1 flex flex-col items-center">
                <img
                  src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={member.fullName}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-orange-500 shadow-sm"
                />
              </div>
              <div className="col-span-3 space-y-1.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-title">{member.fullName}</h2>
                    <p className="text-xs text-orange-600 font-semibold">{dept?.name} ({dept?.shortName})</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    sheet.finalScore >= 85
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : sheet.finalScore >= 70
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    Statut: {sheet.finalScore >= 85 ? 'EXCELLENT' : sheet.finalScore >= 70 ? 'STABLE' : 'A SUIVRE'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-200 pt-2">
                  <p><span className="font-semibold text-slate-800">Spécialité:</span> {member.speciality}</p>
                  <p><span className="font-semibold text-slate-800">Niveau:</span> {member.studyLevel}</p>
                  <p><span className="font-semibold text-slate-800">Matricule:</span> {member.studentCardNumber || 'PCS-2026-08'}</p>
                  <p><span className="font-semibold text-slate-800">Poste:</span> {member.currentPosition}</p>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Évaluation des Critères HR (Pondération)
              </h3>
              <table className="w-full text-left border-collapse border border-slate-200 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2 border border-slate-200">Critère d'évaluation</th>
                    <th className="p-2 border border-slate-200 text-center">Poids</th>
                    <th className="p-2 border border-slate-200 text-center">Note / 100</th>
                    <th className="p-2 border border-slate-200 text-center">Score Pondéré</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-200 font-medium">Présence & Assiduité</td>
                    <td className="p-2 border border-slate-200 text-center">20%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold">{sheet.metrics.presence}%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-orange-600">{(sheet.metrics.presence * 0.20).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 font-medium">Participation aux Réunions</td>
                    <td className="p-2 border border-slate-200 text-center">10%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold">{sheet.metrics.participation}%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-orange-600">{(sheet.metrics.participation * 0.10).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 font-medium">Qualité des Livrables</td>
                    <td className="p-2 border border-slate-200 text-center">20%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold">{sheet.metrics.deliverables}%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-orange-600">{(sheet.metrics.deliverables * 0.20).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 font-medium">Communication Interne</td>
                    <td className="p-2 border border-slate-200 text-center">10%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold">{sheet.metrics.communication}%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-orange-600">{(sheet.metrics.communication * 0.10).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 font-medium">Esprit d'Initiative & Proactivité</td>
                    <td className="p-2 border border-slate-200 text-center">20%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold">{sheet.metrics.initiative}%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-orange-600">{(sheet.metrics.initiative * 0.20).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 font-medium">Activité Facebook & Média</td>
                    <td className="p-2 border border-slate-200 text-center">20%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold">{sheet.metrics.facebookActivity}%</td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-orange-600">{(sheet.metrics.facebookActivity * 0.20).toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Score Highlights Banner */}
            <div className="grid grid-cols-3 gap-3 bg-orange-50/70 p-3 rounded-xl border border-orange-200 text-center">
              <div className="border-r border-orange-200 pr-2">
                <span className="text-[10px] text-slate-600 font-bold uppercase">Note Suivi HR (40%)</span>
                <p className="text-lg font-black text-orange-600">{sheet.hrScore} / 100</p>
              </div>
              <div className="border-r border-orange-200 px-2">
                <span className="text-[10px] text-slate-600 font-bold uppercase">Note Exécution Chef (60%)</span>
                <p className="text-lg font-black text-slate-800">{sheet.executionScore} / 100</p>
              </div>
              <div className="pl-2">
                <span className="text-[10px] text-slate-600 font-bold uppercase">Note Finale Absolue</span>
                <p className="text-lg font-black text-emerald-600">{sheet.finalScore} / 100</p>
              </div>
            </div>

            {/* Observations & AI Insights */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Observation sur le comportement & Engagement:</h4>
                <p className="text-slate-700 italic">{sheet.behaviorObservation || 'Aucune observation enregistrée.'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Analyse Synthétique HR:</h4>
                <p className="text-slate-700">{sheet.hrInsight || 'Évaluation conforme aux exigences du Petroleum Club.'}</p>
              </div>
            </div>

            {/* HR Decision & Objectives */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Décision HR:</h4>
                <span className="px-3 py-1 rounded-md bg-orange-500 text-white font-bold text-xs uppercase inline-block">
                  {sheet.decision === 'encouragement' ? 'ENCOURAGEMENT & PROMOTION' : sheet.decision === 'maintain' ? 'MAINTIEN DE STATUT' : 'PLAN D\'AMÉLIORATION'}
                </span>
                <p className="text-slate-600 text-[11px] mt-2">{sheet.hrComment}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Objectifs Mois Prochain:</h4>
                <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-1">
                  {sheet.nextMonthObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Signatures & Official Stamp */}
            <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-center text-[11px]">
              <div>
                <p className="font-bold text-slate-900">Responsable des Ressources Humaines</p>
                <p className="text-orange-600 font-semibold mt-1">BELABBAS Rayane</p>
                <div className="h-12 border-b border-dashed border-slate-300 mt-2 flex items-center justify-center text-slate-400 italic text-[10px]">
                  [Visa & Signature HR]
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">Président du Petroleum Club Skikda</p>
                <p className="text-slate-700 font-semibold mt-1">BENALI Oussama</p>
                <div className="h-12 border-b border-dashed border-slate-300 mt-2 flex items-center justify-center text-slate-400 italic text-[10px]">
                  [Cachet Officiel PCS]
                </div>
              </div>
            </div>

            <div className="text-center text-[9px] text-slate-400 pt-2 border-t border-slate-100">
              Document officiel généré automatiquement par la plateforme HR de Petroleum Club Skikda — "Step by Step We'll Make It Up"
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
