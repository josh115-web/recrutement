import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react'
import { useAppStore } from '@/store'
import { translations, isRTL } from '@/lib/i18n'

export default function WelcomeSplash() {
  const { currentLanguage, dismissSplashWelcome } = useAppStore()
  const t = translations[currentLanguage] || translations.fr
  const rtl = isRTL(currentLanguage)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white overflow-hidden p-6"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl text-center space-y-8">
        {/* Animated Club Logo & Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto flex flex-col items-center"
        >
          <div className="relative w-28 h-28 rounded-3xl p-1 bg-gradient-to-tr from-orange-500 via-amber-400 to-orange-600 shadow-2xl shadow-orange-500/40">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center overflow-hidden border border-orange-500/30">
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                PCS
              </span>
            </div>
          </div>
          <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Official HR SaaS Platform
          </span>
        </motion.div>

        {/* Club Name & Slogan */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3"
        >
          <h1 className="text-3xl sm:text-5xl font-black font-title tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            {t.appName}
          </h1>
          <p className="text-xl sm:text-2xl font-serif italic text-orange-400 font-medium">
            "{t.slogan}"
          </p>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            {t.university} — Digitize HR workflows, generate official Fiches de Suivi in under 5 minutes, track performance, and automate Member of the Month.
          </p>
        </motion.div>

        {/* Core Pillars */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-3 gap-3 max-w-lg mx-auto"
        >
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur text-center space-y-1">
            <Award className="w-5 h-5 text-orange-400 mx-auto" />
            <p className="text-xs font-bold text-slate-200">Auto MOTM</p>
            <p className="text-[10px] text-slate-400">Department winners</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur text-center space-y-1">
            <Sparkles className="w-5 h-5 text-amber-400 mx-auto" />
            <p className="text-xs font-bold text-slate-200">AI Writing</p>
            <p className="text-[10px] text-slate-400">Smart HR insights</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur text-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-slate-200">Official PDF</p>
            <p className="text-[10px] text-slate-400">Fiche de Suivi A4</p>
          </div>
        </motion.div>

        {/* Enter Dashboard Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button
            onClick={dismissSplashWelcome}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-title font-bold text-base shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>Accéder à la plateforme HR</span>
            <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${rtl ? 'rotate-180' : ''}`} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
