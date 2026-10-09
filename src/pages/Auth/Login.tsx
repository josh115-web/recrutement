import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, ShieldCheck, Flame } from 'lucide-react'
import { useAppStore } from '@/store'
import { CLUB_INFO } from '@/data/pcsMembersData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserRole } from '@/types'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, currentLanguage } = useAppStore()

  const [email, setEmail] = useState('rayane.belabbas@pcs-skikda.org')
  const [password, setPassword] = useState('••••••••••••')

  const handleLogin = (e: React.FormEvent, role: UserRole = 'admin') => {
    e.preventDefault()
    login(role)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6 relative z-10"
      >
        {/* Header with PCS Logo */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-xl shadow-orange-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-black text-orange-400 text-2xl">
              PCS
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black font-title tracking-tight text-white">{CLUB_INFO.name}</h1>
            <p className="text-sm font-serif italic text-orange-400 font-medium">"{CLUB_INFO.slogan}"</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Adresse Email Officielle</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11 bg-slate-950/60 border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Mot de Passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-11 bg-slate-950/60 border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <Button variant="gradient" size="lg" type="submit" className="w-full font-bold text-sm gap-2">
            Se Connecter <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Demo Access Roles */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] text-slate-400 text-center font-medium">Accès Rapide Démo par Rôle:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => handleLogin(e, 'admin')}
              className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors"
            >
              👑 Admin (Président)
            </button>
            <button
              onClick={(e) => handleLogin(e, 'hr_member')}
              className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors"
            >
              📋 Membre HR
            </button>
            <button
              onClick={(e) => handleLogin(e, 'dept_manager')}
              className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors"
            >
              💼 Chef Département
            </button>
            <button
              onClick={(e) => handleLogin(e, 'member')}
              className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors"
            >
              👁️ Membre (Lecture)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
