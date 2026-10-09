import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Trophy,
  Building2,
  Info,
  BarChart3,
  Settings,
  Flame,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { translations, isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const { currentLanguage, userRole } = useAppStore()
  const t = translations[currentLanguage] || translations.fr
  const rtl = isRTL(currentLanguage)

  const navItems = [
    { to: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { to: '/members', label: t.navMembers, icon: Users },
    { to: '/followup', label: t.navFollowUp, icon: FileCheck, highlight: true },
    { to: '/motm', label: t.navMOTM, icon: Trophy, badge: 'AUTO' },
    { to: '/departments', label: t.navDepartments, icon: Building2 },
    { to: '/about', label: t.navAbout, icon: Info },
    { to: '/reports', label: t.navReports, icon: BarChart3 },
    { to: '/settings', label: t.navSettings, icon: Settings },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 transition-all select-none">
      {/* Brand Header with Logo and Slogan */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/20 shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-orange-400 text-sm">
            PCS
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-title font-bold text-sm tracking-tight text-white truncate">
            Petroleum Club
          </span>
          <span className="text-[10px] font-serif italic text-orange-400 truncate">
            "Step by Step..."
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Navigation Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-orange-500/15 text-orange-400 font-bold border border-orange-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-4 h-4 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-orange-400' : 'text-slate-400')} />
                  <span className="truncate flex-1">{item.label}</span>
                  {item.highlight && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-500 text-white animate-pulse">
                      5 min
                    </span>
                  )}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer Profile & Role */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold text-xs flex items-center justify-center shrink-0">
            PCS
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-white truncate">
              BELABBAS Rayane
            </span>
            <span className="text-[10px] text-orange-400 font-medium flex items-center gap-1">
              <Flame className="w-3 h-3" /> HR Manager (PCS)
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
