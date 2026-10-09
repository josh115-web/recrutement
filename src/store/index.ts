import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Member,
  FollowUpSheet,
  MemberOfTheMonthRecord,
  UserRole,
  Language,
  DepartmentId,
  HRMetrics,
  HRDecision,
} from '@/types'
import {
  INITIAL_MEMBERS,
  INITIAL_FOLLOW_UP_SHEETS,
  INITIAL_MOTM_RECORDS,
} from '@/data/pcsMembersData'
import {
  calculateHRScore,
  calculateFinalScore,
  getPerformanceStatus,
  computeMOTMWinners,
} from '@/lib/scoring'

interface AppState {
  // Auth & Settings
  isAuthenticated: boolean;
  userRole: UserRole;
  currentLanguage: Language;
  darkMode: boolean;
  currentMandateYear: string;
  openAIKey: string;
  showSplashWelcome: boolean;

  // Data
  members: Member[];
  followUpSheets: FollowUpSheet[];
  motmRecords: MemberOfTheMonthRecord[];

  // Actions
  login: (role?: UserRole) => void;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  setMandateYear: (year: string) => void;
  setOpenAIKey: (key: string) => void;
  dismissSplashWelcome: () => void;

  // Member CRUD
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  importMembersFromExcel: (newMembers: Member[]) => void;

  // Follow Up Sheet & Execution Score
  saveFollowUpSheet: (sheet: Omit<FollowUpSheet, 'id' | 'createdAt' | 'updatedAt' | 'pdfGenerated'>) => string;
  deleteFollowUpSheet: (id: string) => void;
  updateExecutionScore: (memberId: string, month: string, score: number) => void;

  // MOTM
  recalculateMOTMForMonth: (month: string) => void;

  // Reset
  resetDatabase: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      userRole: 'admin',
      currentLanguage: 'fr',
      darkMode: false,
      currentMandateYear: '2025-2026',
      openAIKey: '',
      showSplashWelcome: true,

      members: INITIAL_MEMBERS,
      followUpSheets: INITIAL_FOLLOW_UP_SHEETS,
      motmRecords: INITIAL_MOTM_RECORDS,

      login: (role = 'admin') => set({ isAuthenticated: true, userRole: role }),
      logout: () => set({ isAuthenticated: false }),
      setUserRole: (role) => set({ userRole: role }),
      setLanguage: (lang) => set({ currentLanguage: lang }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setMandateYear: (year) => set({ currentMandateYear: year }),
      setOpenAIKey: (key) => set({ openAIKey: key }),
      dismissSplashWelcome: () => set({ showSplashWelcome: false }),

      addMember: (memberData) => {
        const id = `pcs-${Date.now().toString().slice(-4)}`
        const newMember: Member = {
          ...memberData,
          id,
        }
        set((state) => ({ members: [newMember, ...state.members] }))
      },

      updateMember: (id, updates) => {
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }))
      },

      deleteMember: (id) => {
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        }))
      },

      importMembersFromExcel: (newMembers) => {
        set((state) => ({
          members: [...newMembers, ...state.members],
        }))
      },

      saveFollowUpSheet: (sheetData) => {
        const state = get()
        const existingIndex = state.followUpSheets.findIndex(
          (s) => s.memberId === sheetData.memberId && s.month === sheetData.month
        )

        const hrScore = calculateHRScore(sheetData.metrics)
        const finalScore = calculateFinalScore(hrScore, sheetData.executionScore)

        const id = existingIndex >= 0
          ? state.followUpSheets[existingIndex].id
          : `fus-${sheetData.month}-${Date.now().toString().slice(-4)}`

        const sheetRecord: FollowUpSheet = {
          ...sheetData,
          id,
          hrScore,
          finalScore,
          createdAt: existingIndex >= 0 ? state.followUpSheets[existingIndex].createdAt : new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          pdfGenerated: true,
        }

        const updatedSheets = existingIndex >= 0
          ? state.followUpSheets.map((s, idx) => (idx === existingIndex ? sheetRecord : s))
          : [sheetRecord, ...state.followUpSheets]

        // Update member aggregated scores & status
        const updatedMembers = state.members.map((m) => {
          if (m.id === sheetData.memberId) {
            return {
              ...m,
              followUpScore: hrScore,
              executionScore: sheetData.executionScore,
              finalScore: finalScore,
              overallStatus: getPerformanceStatus(finalScore),
            }
          }
          return m
        })

        set({
          followUpSheets: updatedSheets,
          members: updatedMembers,
        })

        // Trigger automatic MOTM calculation for this month
        get().recalculateMOTMForMonth(sheetData.month)

        return id
      },

      deleteFollowUpSheet: (id) => {
        set((state) => ({
          followUpSheets: state.followUpSheets.filter((s) => s.id !== id),
        }))
      },

      updateExecutionScore: (memberId, month, score) => {
        const state = get()
        const member = state.members.find((m) => m.id === memberId)
        if (!member) return

        const sheet = state.followUpSheets.find((s) => s.memberId === memberId && s.month === month)
        const hrScore = sheet ? sheet.hrScore : member.followUpScore
        const finalScore = calculateFinalScore(hrScore, score)

        const updatedMembers = state.members.map((m) => {
          if (m.id === memberId) {
            return {
              ...m,
              executionScore: score,
              finalScore: finalScore,
              overallStatus: getPerformanceStatus(finalScore),
            }
          }
          return m
        })

        let updatedSheets = state.followUpSheets
        if (sheet) {
          updatedSheets = state.followUpSheets.map((s) => {
            if (s.id === sheet.id) {
              return {
                ...s,
                executionScore: score,
                finalScore: finalScore,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            }
            return s
          })
        }

        set({
          members: updatedMembers,
          followUpSheets: updatedSheets,
        })

        get().recalculateMOTMForMonth(month)
      },

      recalculateMOTMForMonth: (month) => {
        const state = get()
        const newWinners = computeMOTMWinners(
          state.members,
          state.followUpSheets,
          month,
          state.currentMandateYear
        )

        // Replace MOTM for this month and mandate
        const filtered = state.motmRecords.filter(
          (r) => !(r.month === month && r.mandateYear === state.currentMandateYear)
        )

        set({
          motmRecords: [...newWinners, ...filtered],
        })
      },

      resetDatabase: () => {
        set({
          members: INITIAL_MEMBERS,
          followUpSheets: INITIAL_FOLLOW_UP_SHEETS,
          motmRecords: INITIAL_MOTM_RECORDS,
          currentMandateYear: '2025-2026',
        })
      },
    }),
    {
      name: 'pcs-hr-management-storage',
      partialize: (state) => ({
        userRole: state.userRole,
        currentLanguage: state.currentLanguage,
        darkMode: state.darkMode,
        currentMandateYear: state.currentMandateYear,
        openAIKey: state.openAIKey,
        members: state.members,
        followUpSheets: state.followUpSheets,
        motmRecords: state.motmRecords,
      }),
    }
  )
)
