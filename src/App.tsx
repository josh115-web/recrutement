import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from '@/store'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/Auth/Login'
import DashboardPage from '@/pages/Dashboard'
import MembersPage from '@/pages/Members'
import MemberProfilePage from '@/pages/Members/Profile'
import FollowUpPage from '@/pages/FollowUp'
import MOTMPage from '@/pages/MOTM'
import DepartmentsPage from '@/pages/Departments'
import AboutPCSPage from '@/pages/About'
import ReportsPage from '@/pages/Reports'
import SettingsPage from '@/pages/Settings'
import { Toaster } from '@/components/ui/toaster'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { darkMode } = useAppStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="members/:id" element={<MemberProfilePage />} />
          <Route path="followup" element={<FollowUpPage />} />
          <Route path="motm" element={<MOTMPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="about" element={<AboutPCSPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
