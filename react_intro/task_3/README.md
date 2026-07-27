# Tasks 6 et 7. Tests

Reprise du `dashboard` de la tâche précédente, avec les suites de tests des fonctions
utilitaires et du composant `Notifications`.

## Task 6. Utils tests

[dashboard/src/utils.spec.js](dashboard/src/utils.spec.js) couvre les trois fonctions de
[dashboard/src/utils.js](dashboard/src/utils.js) :

- `getCurrentYear()` — l'horloge est figée avec `jest.useFakeTimers().setSystemTime(...)` sur deux
  années différentes. C'est ce qui évite la bombe à retardement : ni année codée en dur (qui
  périmerait la suite au 1ᵉʳ janvier), ni comparaison à `new Date()` (qui ne ferait que répéter
  l'implémentation).
- `getFooterCopy(isIndex)` — les deux branches, `true` et `false`.
- `getLatestNotification()` — la chaîne HTML attendue.

## Task 7. Test the notifications list

[dashboard/src/Notifications.spec.js](dashboard/src/Notifications.spec.js) couvre
[dashboard/src/Notifications.jsx](dashboard/src/Notifications.jsx) : le titre du panneau, la
présence du bouton, les trois `li` de la liste, et le journal `Close button has been clicked`
émis au clic — simulé avec l'API `fireEvent`.

Les requêtes de texte sont insensibles à la casse. Le message journalisé fait exception : il est
comparé à la chaîne exacte, car cette assertion doit précisément échouer face à un gestionnaire
`onClick` qui journaliserait autre chose.

## Usage

```bash
cd dashboard
npm install
npm run dev     # serveur de développement
npm run lint    # ESLint
npm test        # Jest
```
