import { HRMetrics, PerformanceStatus, Member, FollowUpSheet, MemberOfTheMonthRecord, DepartmentId } from '@/types'

export function calculateHRScore(metrics: HRMetrics): number {
  const presence = (metrics.presence || 0) * 0.20
  const participation = (metrics.participation || 0) * 0.10
  const deliverables = (metrics.deliverables || 0) * 0.20
  const communication = (metrics.communication || 0) * 0.10
  const initiative = (metrics.initiative || 0) * 0.20
  const facebookActivity = (metrics.facebookActivity || 0) * 0.20

  const total = presence + participation + deliverables + communication + initiative + facebookActivity
  return Math.round(total * 10) / 10
}

export function calculateFinalScore(hrScore: number, executionScore: number): number {
  const score = (hrScore * 0.40) + (executionScore * 0.60)
  return Math.round(score * 10) / 10
}

export function getPerformanceStatus(finalScore: number): PerformanceStatus {
  if (finalScore >= 85) return 'excellent'
  if (finalScore >= 70) return 'stable'
  return 'needs_followup'
}

export function getStatusBadgeStyle(status: PerformanceStatus): { bg: string; text: string; label: string } {
  switch (status) {
    case 'excellent':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', label: 'Excellent' }
    case 'stable':
      return { bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', label: 'Stable' }
    case 'needs_followup':
      return { bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', label: 'Needs Follow-up' }
  }
}

export function computeMOTMWinners(
  members: Member[],
  sheets: FollowUpSheet[],
  month: string,
  mandateYear: string
): MemberOfTheMonthRecord[] {
  // Exclude department managers explicitly per requirements
  const eligibleMembers = members.filter(m => !m.isManager && m.mandateYear === mandateYear && m.status === 'active')

  const departments: DepartmentId[] = ['hr', 'communication', 'planning', 'logistic', 'scientific']
  const winners: MemberOfTheMonthRecord[] = []

  departments.forEach(deptId => {
    const deptMembers = eligibleMembers.filter(m => m.departmentId === deptId)
    if (deptMembers.length === 0) return

    // Find latest follow up sheet for month or sort by member final score
    const sorted = [...deptMembers].sort((a, b) => {
      const sheetA = sheets.find(s => s.memberId === a.id && s.month === month)
      const sheetB = sheets.find(s => s.memberId === b.id && s.month === month)
      const scoreA = sheetA ? sheetA.finalScore : a.finalScore
      const scoreB = sheetB ? sheetB.finalScore : b.finalScore
      return scoreB - scoreA
    })

    const topMember = sorted[0]
    if (!topMember) return

    const sheet = sheets.find(s => s.memberId === topMember.id && s.month === month)
    const hrScore = sheet ? sheet.hrScore : topMember.followUpScore
    const execScore = sheet ? sheet.executionScore : topMember.executionScore
    const finalScore = sheet ? sheet.finalScore : topMember.finalScore

    const badgeTitles: Record<DepartmentId, string> = {
      hr: 'HR Cohesion Leader',
      communication: 'Best Creative & Media Impact',
      planning: 'Strategic Planning Champion',
      logistic: 'Operational Excellence Star',
      scientific: 'Research & Innovation Master',
    }

    winners.push({
      id: `motm-${mandateYear}-${month}-${deptId}`,
      month,
      mandateYear,
      departmentId: deptId,
      memberId: topMember.id,
      memberName: topMember.fullName,
      photoUrl: topMember.photoUrl,
      speciality: topMember.speciality,
      finalScore,
      hrScore,
      executionScore: execScore,
      badgeTitle: badgeTitles[deptId] || 'Member of the Month',
      trend: 'up',
    })
  })

  return winners
}
