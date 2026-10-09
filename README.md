# Petroleum Club Skikda — HR Evaluation Portal 2026/2027

Application Web Single Page (Dashboard SPA) moderne pour la gestion et le classement au mérite des entretiens de recrutement du club scientifique **Petroleum Club Skikda** (Université 20 Août 1955 - Skikda).

## 🚀 Fonctionnalités Clés

- **Charte Graphique & Branding Officiel** : Thème sombre moderne (`#0F172A`, `#1E293B`) avec la couleur signature Petroleum Orange (`#FF6300`), typographie bilingue Inter & Cairo, et logo officiel.
- **Classement au Mérite en Temps Réel** : Les candidats sont STRICTEMENT triés du plus grand au plus petit score (`Note Générale`). Badges de rang `#1` (avec couronne dorée), `#2`, `#3`... sans mention de statut binaire d'acceptation/refus.
- **Suivi de Ponctualité** : Horodatage précis (Heure Convoquée vs Heure d'Arrivée) avec bouton automatique "Maintenant" et calcul dynamique du retard en minutes (badges vert/rouge).
- **Grille Évaluative Scientifique & RH (/20)** :
  1. *Section 1 - Formulaire (/20)* : Motivation, Bénévolat, Vision/Idées, Disponibilité.
  2. *Section 2 - Skills & Académique (/20)* : Hard skills (/8), Parcours (/6), Cohérence (/6).
  3. *Section 3 - Situation RH (/20)* : Gestion du temps (/5), Stress (/5), Équipe (/5), Éthique (/5).
  4. *Note Générale Finale (/20)* : Calcul automatique en direct `(Formulaire + Skills + RH) / 3`.
- **Intégration Google Sheets API (Google Apps Script)** :
  - Synchronisation bidirectionnelle via `GET` (chargement initial) et `POST` (`add`, `update`, `delete`).
  - Mode démo & stockage local autonome (`localStorage`) si hors-ligne ou sans connexion Apps Script.
  - Modale de configuration (icône engrenage) avec l'URL WebApp et le code `Code.gs` copiable.
- **Exportations & Recherche Instantanée** : Recherche multi-critères, filtres par spécialité, niveau (L1 à M2) et ponctualité, exportation au format CSV (Excel UTF-8) et JSON.

## 🛠️ Structure du Projet

```
petroleum-club-hr/
├── index.html        # Structure HTML5 responsive avec Tailwind CSS et Modales
├── styles.css        # Animations, barres de progression, scrollbar & thèmes
├── app.js            # Moteur Vanilla JavaScript (State, Tri, API GAS, Toast notifications)
├── logo.png          # Logo officiel du Petroleum Club Skikda
└── README.md         # Documentation du projet
```

## 📋 Configuration de la Feuille Google Sheets (Google Apps Script)

Si vous souhaitez lier l'application à votre propre Google Sheets :

1. Ouvrez votre feuille de calcul Google Sheets.
2. Allez dans **Extensions > Apps Script**.
3. Remplacez le code par le script `Code.gs` fourni dans la modale de configuration de l'application (icône engrenage).
4. Cliquez sur **Déployer > Nouveau déploiement**.
5. Choisissez **Application Web**, définissez l'accès sur **"Tout le monde" (Anyone)** et validez.
6. Copiez l'URL générée et collez-la dans la modale de configuration de l'application.

URL de l'application pré-configurée :
`https://script.google.com/macros/s/AKfycbxArnAQkxuv4NuWEWVXDh5JPlxjz7R9SGUf8aojz3Zjfnhs3o2m51WoeWdtLcKfXDGWHw/exec`
