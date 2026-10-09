export type UserRole = 'admin' | 'hr_member' | 'dept_manager' | 'member';

export type DepartmentId = 'hr' | 'communication' | 'planning' | 'logistic' | 'scientific';

export type MemberStatus = 'active' | 'inactive' | 'suspended' | 'archived';

export type PerformanceStatus = 'excellent' | 'stable' | 'needs_followup';

export type HRDecision = 'maintain' | 'encouragement' | 'improvement_plan';

export interface Department {
  id: DepartmentId;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  icon: string;
  managerId: string;
  managerName: string;
  description: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  emergencyPhone?: string;
  birthDate?: string;
  speciality: string;
  studyLevel: string; // e.g. "Master 1 - Génie des Procédés"
  departmentId: DepartmentId;
  currentPosition: string; // e.g. "Department Manager", "Active Member", "Executive Secretary"
  isManager: boolean;
  roleInClub: 'head' | 'officer' | 'member';
  membershipDate: string;
  status: MemberStatus;
  photoUrl?: string;
  studentCardNumber?: string;
  address?: string;
  mandateYear: string; // e.g. "2025-2026"
  
  // Historical aggregates
  executionScore: number; // 0-100
  followUpScore: number;  // 0-100
  finalScore: number;     // 40% HR + 60% Exec
  attendanceRate: number; // 0-100%
  overallStatus: PerformanceStatus;
}

export interface HRMetrics {
  presence: number;      // 0-100 (20% weight)
  participation: number; // 0-100 (10% weight)
  deliverables: number;  // 0-100 (20% weight)
  communication: number; // 0-100 (10% weight)
  initiative: number;    // 0-100 (20% weight)
  facebookActivity: number; // 0-100 (20% weight)
}

export interface FollowUpSheet {
  id: string;
  memberId: string;
  memberName: string;
  departmentId: DepartmentId;
  month: string; // e.g. "2026-07"
  mandateYear: string; // e.g. "2025-2026"
  metrics: HRMetrics;
  hrScore: number; // 0-100 calculated from weighted metrics
  executionScore: number; // 0-100 given by manager
  finalScore: number;     // (0.4 * hrScore) + (0.6 * executionScore)
  behaviorObservation: string;
  hrInsight: string;
  hrComment: string;
  decision: HRDecision;
  nextMonthObjectives: string[];
  evaluatorId: string;
  evaluatorName: string;
  createdAt: string;
  updatedAt: string;
  pdfGenerated: boolean;
}

export interface ExecutionScoreRecord {
  id: string;
  memberId: string;
  month: string;
  mandateYear: string;
  score: number; // 0-100
  managerId: string;
  managerName: string;
  notes?: string;
  updatedAt: string;
}

export interface MemberOfTheMonthRecord {
  id: string;
  month: string;
  mandateYear: string;
  departmentId: DepartmentId;
  memberId: string;
  memberName: string;
  photoUrl?: string;
  speciality: string;
  finalScore: number;
  hrScore: number;
  executionScore: number;
  badgeTitle: string;
  trend: 'up' | 'stable' | 'new';
}

export interface Mandate {
  year: string; // "2025-2026"
  isCurrent: boolean;
  presidentName: string;
  vicePresidentName: string;
  slogan: string;
  startDate: string;
  endDate: string;
  totalMembers: number;
}

export interface PresidentHistory {
  mandateYear: string;
  presidentName: string;
  vicePresidentName: string;
  photoUrl?: string;
  keyAchievements: string[];
}

export interface ClubInfo {
  name: string;
  shortName: string;
  slogan: string;
  university: string;
  faculty: string;
  city: string;
  country: string;
  logoUrl: string;
  email: string;
  phone: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
}

export type Language = 'fr' | 'en' | 'ar';
