import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Globe, Moon, Sun, Key, Shield, RefreshCw, Check, Sparkles, Calendar } from 'lucide-react'
import { useAppStore } from '@/store'
import { MANDATES, CLUB_INFO } from '@/data/pcsMembersData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Language } from '@/types'

export default function SettingsPage() {
  const {
    currentLanguage,
    setLanguage,
    darkMode,
    toggleDarkMode,
    currentMandateYear,
    setMandateYear,
    openAIKey,
    setOpenAIKey,
    resetDatabase,
  } = useAppStore()

  const [tempKey, setTempKey] = useState(openAIKey)
  const [keySaved, setKeySaved] = useState(false)
  const [newMandateYear, setNewMandateYear] = useState('')

  const handleSaveKey = () => {
    setOpenAIKey(tempKey)
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  const handleCreateMandate = () => {
    if (!newMandateYear) return
    setMandateYear(newMandateYear)
    setNewMandateYear('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 text-xs font-bold mb-2">
            <Settings className="w-4 h-4" /> Paramètres du Système
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-title text-foreground">
            Configuration & Paramètres PCS
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gérez les paramètres globaux de l'application, les années de mandat et la clé IA.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OpenAI API Key Card */}
        <Card className="border-amber-200 dark:border-amber-950">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" /> Clé API OpenAI (Optionnelle)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Entrez votre propre clé OpenAI (sk-...) pour utiliser GPT-3.5/GPT-4 lors de la rédaction des appréciations HR. Si aucune clé n'est fournie, le générateur intelligent local PCS prendra le relais.
            </p>
            <div className="space-y-2">
              <Input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="sk-proj-..."
                className="text-xs font-mono"
              />
              <Button size="sm" onClick={handleSaveKey} className="gap-2 text-xs font-bold w-full">
                {keySaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
                {keySaved ? 'Clé Enregistrée !' : 'Sauvegarder la Clé'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mandate Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" /> Gestion des Mandats PCS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Sélectionnez le mandat actif pour filtrer automatiquement toutes les données et rapports, ou ajoutez un nouveau mandat.
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Ex: 2026-2027"
                value={newMandateYear}
                onChange={(e) => setNewMandateYear(e.target.value)}
                className="text-xs"
              />
              <Button size="sm" onClick={handleCreateMandate} className="text-xs font-bold shrink-0">
                Ajouter Mandat
              </Button>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-muted-foreground block">Mandat Sélectionné Actuel</span>
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">Mandat {currentMandateYear}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500 text-white font-bold">Actif</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display & Language Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-500" /> Langue & Affichage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-2">Langue de l'Interface</label>
              <div className="grid grid-cols-3 gap-2">
                {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                  <Button
                    key={lang}
                    variant={currentLanguage === lang ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage(lang)}
                    className="text-xs font-bold uppercase"
                  >
                    {lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : 'العربية (RTL)'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">Mode Sombre (Dark Mode)</span>
                <span className="text-[11px] text-muted-foreground">Basculez entre le thème sombre et clair</span>
              </div>
              <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Reset Card */}
        <Card className="border-red-200 dark:border-red-950">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-500">
              <RefreshCw className="w-5 h-5" /> Réinitialisation de la Base de Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Réinitialise la base de données locale pour restaurer les 36 membres initiaux, départements et historiques du Petroleum Club Skikda.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Voulez-vous vraiment réinitialiser la base de données PCS aux valeurs d\'origine ?')) {
                  resetDatabase()
                }
              }}
              className="gap-2 text-xs font-bold w-full"
            >
              <RefreshCw className="w-4 h-4" /> Réinitialiser aux données d'origine
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
