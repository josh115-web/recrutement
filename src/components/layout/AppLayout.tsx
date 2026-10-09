import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './Header'
import Sidebar from './Sidebar'
import WelcomeSplash from './WelcomeSplash'
import { useAppStore } from '@/store'
import { isRTL } from '@/lib/i18n'

export default function AppLayout() {
  const { currentLanguage, showSplashWelcome } = useAppStore()
  const rtl = isRTL(currentLanguage)

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-background font-sans ${rtl ? 'rtl' : 'ltr'}`}>
      <AnimatePresence>
        {showSplashWelcome && <WelcomeSplash />}
      </AnimatePresence>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
