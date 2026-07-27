# Task 2. Embedding expressions, functions

Reprise du `dashboard` de la tâche précédente, enrichi de fonctions utilitaires et d'un
premier composant enfant.

## Ajouts

- [dashboard/src/utils.js](dashboard/src/utils.js) — `getCurrentYear()` renvoie l'année en
  cours, `getFooterCopy(isIndex)` renvoie `Holberton School` si `isIndex` vaut `true`, sinon
  `Holberton School main dashboard`.
- [dashboard/src/Notifications.jsx](dashboard/src/Notifications.jsx) — un `div.notification-items`
  contenant le paragraphe `Here is the list of notifications`.
- [dashboard/src/Notifications.css](dashboard/src/Notifications.css) — encadré pointillé rouge,
  positionné en haut à droite via `.root-notifications`.

`App.jsx` rend `Notifications` comme enfant, dans un `div.root-notifications`, et son pied de
page utilise désormais les deux fonctions de `utils.js`.

## Usage

```bash
cd dashboard
npm install
npm run dev     # serveur de développement
npm run lint    # ESLint
npm test        # Jest
```
