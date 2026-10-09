import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Search,
  Sun,
  Moon,
  Globe,
  Calendar,
  Shield,
  UserCheck,
  ChevronDown,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MANDATES } from '@/data/pcsMembersData'
import { translations, isRTL } from '@/lib/i18n'
import { UserRole, Language } from '@/types'

export default function Header() {
  const location = useLocation()
  const {
    currentLanguage,
    setLanguage,
    darkMode,
    toggleDarkMode,
    currentMandateYear,
    setMandateYear,
    userRole,
    setUserRole,
  } = useAppStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showMandateMenu, setShowMandateMenu] = useState(false)

  const t = translations[currentLanguage] || translations.fr
  const rtl = isRTL(currentLanguage)

  const rolesList: { id: UserRole; label: string; icon: string }[] = [
    { id: 'admin', label: t.roleAdmin, icon: '👑' },
    { id: 'hr_member', label: t.roleHR, icon: '📋' },
    { id: 'dept_manager', label: t.roleManager, icon: '💼' },
    { id: 'member', label: t.roleMember, icon: '👁️' },
  ]

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 transition-colors">
      {/* Left section: Search & Slogan indicator */}
      <div className="flex items-center gap-3">
        <div className="relative w-48 sm:w-64">
          <Search className={`absolute ${rtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`${rtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-9 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 rounded-xl`}
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="text-xs font-serif italic font-semibold text-orange-600 dark:text-orange-400">
            "{t.slogan}"
          </span>
        </div>
      </div>

      {/* Right section: Mandate, Role, Language, Theme */}
      <div className="flex items-center gap-2">
        {/* Mandate Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMandateMenu(!showMandateMenu)
              setShowLangMenu(false)
              setShowRoleMenu(false)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/60 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline text-muted-foreground">{t.filterMandate}:</span>
            <span className="font-semibold text-foreground">{currentMandateYear}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {showMandateMenu && (
            <div className={`absolute ${rtl ? 'left-0' : 'right-0'} mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-xl p-1.5 z-50`}>
              <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {t.filterMandate}
              </div>
              {MANDATES.map((m) => (
                <button
                  key={m.year}
                  onClick={() => {
                    setMandateYear(m.year)
                    setShowMandateMenu(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                    currentMandateYear === m.year
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground'
                  }`}
                >
                  <span>Mandat {m.year}</span>
                  {m.isCurrent && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-500 text-white font-bold">
                      Actif
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role Simulator Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu)
              setShowLangMenu(false)
              setShowMandateMenu(false)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/60 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline font-semibold text-foreground">
              {rolesList.find((r) => r.id === userRole)?.label}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {showRoleMenu && (
            <div className={`absolute ${rtl ? 'left-0' : 'right-0'} mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-xl p-1.5 z-50`}>
              <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Tester un rôle
              </div>
              {rolesList.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setUserRole(r.id)
                    setShowRoleMenu(false)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                    userRole === r.id
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground'
                  }`}
                >
                  <span className="text-sm">{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu)
              setShowRoleMenu(false)
              setShowMandateMenu(false)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/60 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer uppercase"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-bold text-foreground">{currentLanguage}</span>
          </button>

          {showLangMenu && (
            <div className={`absolute ${rtl ? 'left-0' : 'right-0'} mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-xl p-1.5 z-50`}>
              {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang)
                    setShowLangMenu(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    currentLanguage === lang
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground'
                  }`}
                >
                  <span>{lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : 'العربية (RTL)'}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={toggleDarkMode}
          title="Mode Sombre / Clair"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </Button>
      </div>
    </header>
  )
}
