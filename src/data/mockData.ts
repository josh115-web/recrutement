import type {
  Department,
  Member,
  Activity,
  AttendanceRecord,
  PerformanceScore,
  Notification,
} from '@/types'

// ─── Departments ────────────────────────────────────────────────────────────
export const DEPARTMENTS: Department[] = [
  {
    id: 'planning',
    name: 'Planning & Development',
    shortName: 'P&D',
    color: '#6366F1',
    bgColor: '#EEF2FF',
    icon: '📐',
    headId: 'mem-001',
    description: 'Responsible for strategic planning and club development initiatives.',
  },
  {
    id: 'hr',
    name: 'Human Resources',
    shortName: 'HR',
    color: '#F26522',
    bgColor: '#FFF4ED',
    icon: '👥',
    headId: 'mem-006',
    description: 'Manages member relations, recruitment, and internal well-being.',
  },
  {
    id: 'communication',
    name: 'Communication & Marketing',
    shortName: 'C&M',
    color: '#EC4899',
    bgColor: '#FDF2F8',
    icon: '📣',
    headId: 'mem-011',
    description: 'Handles social media, PR, events promotion, and media production.',
  },
  {
    id: 'scientific',
    name: 'Scientific Research & Development',
    shortName: 'SR&D',
    color: '#10B981',
    bgColor: '#ECFDF5',
    icon: '🔬',
    headId: 'mem-016',
    description: 'Conducts technical workshops, research, and scientific projects.',
  },
  {
    id: 'logistic',
    name: 'Logistic & Finance',
    shortName: 'L&F',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    icon: '💼',
    headId: 'mem-021',
    description: 'Manages club finances, logistics, and resource allocation.',
  },
]

// ─── Avatar Generator (deterministic colors) ────────────────────────────────
const AVATAR_COLORS = [
  '#F26522','#6366F1','#EC4899','#10B981','#3B82F6',
  '#8B5CF6','#F59E0B','#EF4444','#14B8A6','#06B6D4',
]

export function getAvatarColor(id: string): string {
  const index = parseInt(id.replace(/\D/g, '').slice(-2)) % AVATAR_COLORS.length
  return AVATAR_COLORS[index] ?? AVATAR_COLORS[0]
}

// ─── Members ─────────────────────────────────────────────────────────────────
export const MEMBERS: Member[] = [
  // Planning & Development (5 members)
  {
    id: 'mem-001', firstName: 'Yacine', lastName: 'Belhadi', fullName: 'Yacine Belhadi',
    gender: 'male', email: 'yacine.belhadi@petroleum-club.dz', phone: '+213 555 011 001',
    departmentId: 'planning', role: 'head', joiningDate: '2023-09-01', status: 'active',
    photoUrl: '', comments: 'Excellent strategic thinker and natural leader.',
    executionScore: 55, followUpScore: 37, attendanceRate: 95,
    totalScore: 92, overallPerformance: 88,
  },
  {
    id: 'mem-002', firstName: 'Meriem', lastName: 'Kaci', fullName: 'Meriem Kaci',
    gender: 'female', email: 'meriem.kaci@petroleum-club.dz', phone: '+213 555 011 002',
    departmentId: 'planning', role: 'officer', joiningDate: '2023-09-15', status: 'active',
    photoUrl: '', comments: 'Very organized and detail-oriented.',
    executionScore: 50, followUpScore: 35, attendanceRate: 90,
    totalScore: 85, overallPerformance: 83,
  },
  {
    id: 'mem-003', firstName: 'Bilal', lastName: 'Mansouri', fullName: 'Bilal Mansouri',
    gender: 'male', email: 'bilal.mansouri@petroleum-club.dz', phone: '+213 555 011 003',
    departmentId: 'planning', role: 'member', joiningDate: '2024-01-10', status: 'active',
    photoUrl: '', comments: 'Promising member with great potential.',
    executionScore: 42, followUpScore: 30, attendanceRate: 82,
    totalScore: 72, overallPerformance: 70,
  },
  {
    id: 'mem-004', firstName: 'Sarah', lastName: 'Djelloul', fullName: 'Sarah Djelloul',
    gender: 'female', email: 'sarah.djelloul@petroleum-club.dz', phone: '+213 555 011 004',
    departmentId: 'planning', role: 'member', joiningDate: '2024-02-01', status: 'active',
    photoUrl: '', comments: 'Creative and dedicated.',
    executionScore: 48, followUpScore: 33, attendanceRate: 88,
    totalScore: 81, overallPerformance: 79,
  },
  {
    id: 'mem-005', firstName: 'Amine', lastName: 'Zerrouki', fullName: 'Amine Zerrouki',
    gender: 'male', email: 'amine.zerrouki@petroleum-club.dz', phone: '+213 555 011 005',
    departmentId: 'planning', role: 'member', joiningDate: '2024-03-01', status: 'active',
    photoUrl: '', comments: 'Still developing skills.',
    executionScore: 35, followUpScore: 25, attendanceRate: 75,
    totalScore: 60, overallPerformance: 57,
  },
  // Human Resources (5 members)
  {
    id: 'mem-006', firstName: 'Rania', lastName: 'Benali', fullName: 'Rania Benali',
    gender: 'female', email: 'rania.benali@petroleum-club.dz', phone: '+213 555 011 006',
    departmentId: 'hr', role: 'head', joiningDate: '2023-09-01', status: 'active',
    photoUrl: '', comments: 'HR expert with strong interpersonal skills.',
    executionScore: 57, followUpScore: 38, attendanceRate: 98,
    totalScore: 95, overallPerformance: 94,
  },
  {
    id: 'mem-007', firstName: 'Karim', lastName: 'Ouali', fullName: 'Karim Ouali',
    gender: 'male', email: 'karim.ouali@petroleum-club.dz', phone: '+213 555 011 007',
    departmentId: 'hr', role: 'officer', joiningDate: '2023-10-01', status: 'active',
    photoUrl: '', comments: 'Reliable and punctual.',
    executionScore: 52, followUpScore: 36, attendanceRate: 93,
    totalScore: 88, overallPerformance: 86,
  },
  {
    id: 'mem-008', firstName: 'Nadia', lastName: 'Hamdoune', fullName: 'Nadia Hamdoune',
    gender: 'female', email: 'nadia.hamdoune@petroleum-club.dz', phone: '+213 555 011 008',
    departmentId: 'hr', role: 'member', joiningDate: '2024-01-01', status: 'active',
    photoUrl: '', comments: 'Great communicator.',
    executionScore: 45, followUpScore: 31, attendanceRate: 85,
    totalScore: 76, overallPerformance: 74,
  },
  {
    id: 'mem-009', firstName: 'Hamza', lastName: 'Bouri', fullName: 'Hamza Bouri',
    gender: 'male', email: 'hamza.bouri@petroleum-club.dz', phone: '+213 555 011 009',
    departmentId: 'hr', role: 'member', joiningDate: '2024-02-15', status: 'active',
    photoUrl: '', comments: 'Enthusiastic and eager to learn.',
    executionScore: 40, followUpScore: 28, attendanceRate: 80,
    totalScore: 68, overallPerformance: 65,
  },
  {
    id: 'mem-010', firstName: 'Lina', lastName: 'Tahar', fullName: 'Lina Tahar',
    gender: 'female', email: 'lina.tahar@petroleum-club.dz', phone: '+213 555 011 010',
    departmentId: 'hr', role: 'member', joiningDate: '2024-03-10', status: 'active',
    photoUrl: '', comments: 'Fast learner.',
    executionScore: 38, followUpScore: 27, attendanceRate: 78,
    totalScore: 65, overallPerformance: 62,
  },
  // Communication & Marketing (5 members)
  {
    id: 'mem-011', firstName: 'Ryad', lastName: 'Medjdoub', fullName: 'Ryad Medjdoub',
    gender: 'male', email: 'ryad.medjdoub@petroleum-club.dz', phone: '+213 555 011 011',
    departmentId: 'communication', role: 'head', joiningDate: '2023-09-01', status: 'active',
    photoUrl: '', comments: 'Creative visionary and media expert.',
    executionScore: 54, followUpScore: 36, attendanceRate: 92,
    totalScore: 90, overallPerformance: 87,
  },
  {
    id: 'mem-012', firstName: 'Yasmine', lastName: 'Bensaid', fullName: 'Yasmine Bensaid',
    gender: 'female', email: 'yasmine.bensaid@petroleum-club.dz', phone: '+213 555 011 012',
    departmentId: 'communication', role: 'officer', joiningDate: '2023-11-01', status: 'active',
    photoUrl: '', comments: 'Excellent graphic designer.',
    executionScore: 53, followUpScore: 37, attendanceRate: 94,
    totalScore: 90, overallPerformance: 88,
  },
  {
    id: 'mem-013', firstName: 'Fares', lastName: 'Amrani', fullName: 'Fares Amrani',
    gender: 'male', email: 'fares.amrani@petroleum-club.dz', phone: '+213 555 011 013',
    departmentId: 'communication', role: 'member', joiningDate: '2024-01-20', status: 'active',
    photoUrl: '', comments: 'Good social media presence.',
    executionScore: 44, followUpScore: 30, attendanceRate: 84,
    totalScore: 74, overallPerformance: 72,
  },
  {
    id: 'mem-014', firstName: 'Ines', lastName: 'Chaoui', fullName: 'Ines Chaoui',
    gender: 'female', email: 'ines.chaoui@petroleum-club.dz', phone: '+213 555 011 014',
    departmentId: 'communication', role: 'member', joiningDate: '2024-02-10', status: 'active',
    photoUrl: '', comments: 'Strong writing skills.',
    executionScore: 47, followUpScore: 32, attendanceRate: 87,
    totalScore: 79, overallPerformance: 77,
  },
  {
    id: 'mem-015', firstName: 'Mehdi', lastName: 'Larbi', fullName: 'Mehdi Larbi',
    gender: 'male', email: 'mehdi.larbi@petroleum-club.dz', phone: '+213 555 011 015',
    departmentId: 'communication', role: 'member', joiningDate: '2024-03-05', status: 'inactive',
    photoUrl: '', comments: 'On temporary leave.',
    executionScore: 30, followUpScore: 20, attendanceRate: 60,
    totalScore: 50, overallPerformance: 46,
  },
  // Scientific Research & Development (5 members)
  {
    id: 'mem-016', firstName: 'Abdelmalek', lastName: 'Hadj', fullName: 'Abdelmalek Hadj',
    gender: 'male', email: 'abdelmalek.hadj@petroleum-club.dz', phone: '+213 555 011 016',
    departmentId: 'scientific', role: 'head', joiningDate: '2023-09-01', status: 'active',
    photoUrl: '', comments: 'Top researcher and technical leader.',
    executionScore: 58, followUpScore: 39, attendanceRate: 97,
    totalScore: 97, overallPerformance: 96,
  },
  {
    id: 'mem-017', firstName: 'Sonia', lastName: 'Ferhat', fullName: 'Sonia Ferhat',
    gender: 'female', email: 'sonia.ferhat@petroleum-club.dz', phone: '+213 555 011 017',
    departmentId: 'scientific', role: 'officer', joiningDate: '2023-09-20', status: 'active',
    photoUrl: '', comments: 'Brilliant researcher with attention to detail.',
    executionScore: 55, followUpScore: 38, attendanceRate: 95,
    totalScore: 93, overallPerformance: 91,
  },
  {
    id: 'mem-018', firstName: 'Oussama', lastName: 'Benkaci', fullName: 'Oussama Benkaci',
    gender: 'male', email: 'oussama.benkaci@petroleum-club.dz', phone: '+213 555 011 018',
    departmentId: 'scientific', role: 'member', joiningDate: '2024-01-05', status: 'active',
    photoUrl: '', comments: 'Excellent in technical presentations.',
    executionScore: 50, followUpScore: 34, attendanceRate: 91,
    totalScore: 84, overallPerformance: 82,
  },
  {
    id: 'mem-019', firstName: 'Amira', lastName: 'Belghit', fullName: 'Amira Belghit',
    gender: 'female', email: 'amira.belghit@petroleum-club.dz', phone: '+213 555 011 019',
    departmentId: 'scientific', role: 'member', joiningDate: '2024-02-01', status: 'active',
    photoUrl: '', comments: 'Strong analytical skills.',
    executionScore: 48, followUpScore: 33, attendanceRate: 89,
    totalScore: 81, overallPerformance: 79,
  },
  {
    id: 'mem-020', firstName: 'Walid', lastName: 'Bouzid', fullName: 'Walid Bouzid',
    gender: 'male', email: 'walid.bouzid@petroleum-club.dz', phone: '+213 555 011 020',
    departmentId: 'scientific', role: 'member', joiningDate: '2024-03-15', status: 'active',
    photoUrl: '', comments: 'Dedicated and improving quickly.',
    executionScore: 43, followUpScore: 29, attendanceRate: 83,
    totalScore: 72, overallPerformance: 70,
  },
  // Logistic & Finance (5 members)
  {
    id: 'mem-021', firstName: 'Sofiane', lastName: 'Belkacemi', fullName: 'Sofiane Belkacemi',
    gender: 'male', email: 'sofiane.belkacemi@petroleum-club.dz', phone: '+213 555 011 021',
    departmentId: 'logistic', role: 'head', joiningDate: '2023-09-01', status: 'active',
    photoUrl: '', comments: 'Excellent financial manager and logistic coordinator.',
    executionScore: 56, followUpScore: 38, attendanceRate: 96,
    totalScore: 94, overallPerformance: 93,
  },
  {
    id: 'mem-022', firstName: 'Houria', lastName: 'Mernissi', fullName: 'Houria Mernissi',
    gender: 'female', email: 'houria.mernissi@petroleum-club.dz', phone: '+213 555 011 022',
    departmentId: 'logistic', role: 'officer', joiningDate: '2023-10-15', status: 'active',
    photoUrl: '', comments: 'Very precise with numbers and budgets.',
    executionScore: 52, followUpScore: 35, attendanceRate: 92,
    totalScore: 87, overallPerformance: 85,
  },
  {
    id: 'mem-023', firstName: 'Tarek', lastName: 'Guerfi', fullName: 'Tarek Guerfi',
    gender: 'male', email: 'tarek.guerfi@petroleum-club.dz', phone: '+213 555 011 023',
    departmentId: 'logistic', role: 'member', joiningDate: '2024-01-10', status: 'active',
    photoUrl: '', comments: 'Good logistics and procurement skills.',
    executionScore: 46, followUpScore: 31, attendanceRate: 86,
    totalScore: 77, overallPerformance: 75,
  },
  {
    id: 'mem-024', firstName: 'Cylia', lastName: 'Ait-Amar', fullName: 'Cylia Ait-Amar',
    gender: 'female', email: 'cylia.aitamar@petroleum-club.dz', phone: '+213 555 011 024',
    departmentId: 'logistic', role: 'member', joiningDate: '2024-02-20', status: 'active',
    photoUrl: '', comments: 'Diligent and responsible.',
    executionScore: 44, followUpScore: 30, attendanceRate: 84,
    totalScore: 74, overallPerformance: 72,
  },
  {
    id: 'mem-025', firstName: 'Nassim', lastName: 'Ramdani', fullName: 'Nassim Ramdani',
    gender: 'male', email: 'nassim.ramdani@petroleum-club.dz', phone: '+213 555 011 025',
    departmentId: 'logistic', role: 'member', joiningDate: '2024-03-01', status: 'active',
    photoUrl: '', comments: 'New member showing promise.',
    executionScore: 37, followUpScore: 26, attendanceRate: 77,
    totalScore: 63, overallPerformance: 60,
  },
]

// ─── Activities ──────────────────────────────────────────────────────────────
export const ACTIVITIES: Activity[] = [
  {
    id: 'act-001', title: 'Monthly General Assembly',
    description: 'Monthly meeting of all club members to review progress and plan upcoming activities.',
    location: 'Amphitheater A, Faculty of Hydrocarbons', date: '2024-07-15', time: '10:00',
    departmentId: 'all', responsibleId: 'mem-001', status: 'completed', createdAt: '2024-07-10T08:00:00Z',
  },
  {
    id: 'act-002', title: 'Petroleum Engineering Workshop',
    description: 'Technical workshop on reservoir simulation and modeling.',
    location: 'Computer Lab 3', date: '2024-07-20', time: '14:00',
    departmentId: 'scientific', responsibleId: 'mem-016', status: 'completed', createdAt: '2024-07-12T09:00:00Z',
  },
  {
    id: 'act-003', title: 'HR Training Session',
    description: 'Internal training for HR department members on member management and follow-up.',
    location: 'Meeting Room 2', date: '2024-07-22', time: '09:00',
    departmentId: 'hr', responsibleId: 'mem-006', status: 'completed', createdAt: '2024-07-15T10:00:00Z',
  },
  {
    id: 'act-004', title: 'Social Media Strategy Meeting',
    description: 'Planning the club\'s content calendar for the new semester.',
    location: 'Club Office', date: '2024-07-25', time: '15:00',
    departmentId: 'communication', responsibleId: 'mem-011', status: 'completed', createdAt: '2024-07-18T11:00:00Z',
  },
  {
    id: 'act-005', title: 'Budget Review Q3',
    description: 'Quarterly budget review and financial planning session.',
    location: 'Admin Building, Room 105', date: '2024-07-28', time: '11:00',
    departmentId: 'logistic', responsibleId: 'mem-021', status: 'ongoing', createdAt: '2024-07-20T08:00:00Z',
  },
  {
    id: 'act-006', title: 'Club Anniversary Celebration',
    description: 'Annual celebration of the club\'s founding anniversary with all departments.',
    location: 'Main Hall, University Campus', date: '2024-08-05', time: '18:00',
    departmentId: 'all', responsibleId: 'mem-001', status: 'planned', createdAt: '2024-07-25T09:00:00Z',
  },
  {
    id: 'act-007', title: 'Scientific Seminar: AI in Petroleum',
    description: 'Seminar on the application of artificial intelligence in the petroleum industry.',
    location: 'Amphitheater B', date: '2024-08-10', time: '10:00',
    departmentId: 'scientific', responsibleId: 'mem-017', status: 'planned', createdAt: '2024-07-26T10:00:00Z',
  },
  {
    id: 'act-008', title: 'Recruitment Drive 2024',
    description: 'Open day to recruit new members for the club.',
    location: 'Faculty Entrance Hall', date: '2024-08-15', time: '09:00',
    departmentId: 'hr', responsibleId: 'mem-006', status: 'planned', createdAt: '2024-07-27T08:00:00Z',
  },
]

// ─── Attendance Records ───────────────────────────────────────────────────────
export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  // Activity 1 - General Assembly (all members)
  ...MEMBERS.map((m, i) => ({
    id: `att-001-${m.id}`,
    activityId: 'act-001',
    memberId: m.id,
    status: (i % 7 === 3 ? 'absent' : i % 7 === 5 ? 'late' : i % 7 === 6 ? 'excused' : 'present') as 'present' | 'late' | 'absent' | 'excused',
    recordedAt: '2024-07-15T10:30:00Z',
  })),
  // Activity 2 - Scientific members
  ...MEMBERS.filter(m => m.departmentId === 'scientific').map((m, i) => ({
    id: `att-002-${m.id}`,
    activityId: 'act-002',
    memberId: m.id,
    status: (i === 3 ? 'absent' : 'present') as 'present' | 'late' | 'absent' | 'excused',
    recordedAt: '2024-07-20T14:30:00Z',
  })),
  // Activity 3 - HR members
  ...MEMBERS.filter(m => m.departmentId === 'hr').map((m, i) => ({
    id: `att-003-${m.id}`,
    activityId: 'act-003',
    memberId: m.id,
    status: (i === 4 ? 'late' : 'present') as 'present' | 'late' | 'absent' | 'excused',
    recordedAt: '2024-07-22T09:30:00Z',
  })),
  // Activity 4 - Communication members
  ...MEMBERS.filter(m => m.departmentId === 'communication').map((m, i) => ({
    id: `att-004-${m.id}`,
    activityId: 'act-004',
    memberId: m.id,
    status: (i === 4 ? 'absent' : 'present') as 'present' | 'late' | 'absent' | 'excused',
    recordedAt: '2024-07-25T15:30:00Z',
  })),
]

// ─── Performance Scores ───────────────────────────────────────────────────────
export const PERFORMANCE_SCORES: PerformanceScore[] = [
  ...MEMBERS.slice(0, 10).map(m => ({
    id: `perf-001-${m.id}`,
    activityId: 'act-001',
    memberId: m.id,
    executionScore: Math.round(m.executionScore * 0.9),
    followUpScore: Math.round(m.followUpScore * 0.9),
    notes: 'Good participation in the assembly.',
    recordedAt: '2024-07-15T12:00:00Z',
  })),
]

// ─── Notifications ────────────────────────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001', title: 'New Member Added',
    body: 'Nassim Ramdani has joined the Logistic & Finance department.',
    type: 'member', read: false, createdAt: '2024-07-27T10:00:00Z',
  },
  {
    id: 'notif-002', title: 'Activity Created',
    body: 'Recruitment Drive 2024 has been scheduled for August 15.',
    type: 'activity', read: false, createdAt: '2024-07-27T08:00:00Z',
  },
  {
    id: 'notif-003', title: 'Member of the Month',
    body: 'Abdelmalek Hadj has been selected as the best member of Scientific R&D for July 2024.',
    type: 'motm', read: false, createdAt: '2024-07-26T18:00:00Z',
  },
  {
    id: 'notif-004', title: 'Attendance Completed',
    body: 'Attendance for Social Media Strategy Meeting has been recorded.',
    type: 'attendance', read: true, createdAt: '2024-07-25T16:00:00Z',
  },
  {
    id: 'notif-005', title: 'Performance Updated',
    body: 'Performance scores for Monthly General Assembly have been submitted.',
    type: 'performance', read: true, createdAt: '2024-07-15T13:00:00Z',
  },
  {
    id: 'notif-006', title: 'Member of the Month',
    body: 'Rania Benali has been selected as the best member of HR department for June 2024.',
    type: 'motm', read: true, createdAt: '2024-06-30T18:00:00Z',
  },
]

// ─── Attendance chart data ────────────────────────────────────────────────────
export const ATTENDANCE_CHART_DATA = [
  { month: 'Feb', rate: 78 },
  { month: 'Mar', rate: 82 },
  { month: 'Apr', rate: 79 },
  { month: 'May', rate: 85 },
  { month: 'Jun', rate: 88 },
  { month: 'Jul', rate: 91 },
]

// ─── Department performance chart data ───────────────────────────────────────
export const DEPT_PERFORMANCE_DATA = [
  { dept: 'P&D', performance: 75, attendance: 86 },
  { dept: 'HR', performance: 76, attendance: 87 },
  { dept: 'C&M', performance: 74, attendance: 82 },
  { dept: 'SR&D', performance: 84, attendance: 91 },
  { dept: 'L&F', performance: 77, attendance: 87 },
]
