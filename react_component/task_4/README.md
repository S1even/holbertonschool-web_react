# Task 5. High Order Component / HOC

Reprise du `dashboard` de la [tâche 3](../task_3). Un composant d'ordre supérieur journalise le
montage et le démontage de ce qu'on lui confie, au lieu de répéter le même `componentDidMount`
partout.

## `HOC/WithLogging.jsx`

`WithLogging` prend un composant et en renvoie un autre, une classe, qui rend le composant reçu
avec toutes ses props et journalise deux lignes :

| Moment | Message |
| --- | --- |
| `componentDidMount()` | `Component NAME is mounted` |
| `componentWillUnmount()` | `Component NAME is going to unmount` |

`NAME` vient de `displayName`, sinon de `name`, sinon vaut `Component` — ce dernier cas couvre une
fonction anonyme passée directement au HOC. Le composant renvoyé porte lui-même
`displayName = WithLogging(NAME)`, ce qui le rend lisible dans l'extension React de Chrome.

## Les composants enveloppés

`Login.jsx` et `CourseList.jsx` n'exportent plus leur fonction, mais sa version enveloppée :

```jsx
const LoginWithLogging = WithLogging(Login)

export default LoginWithLogging
```

Le passage par une constante nommée n'est pas cosmétique : `export default WithLogging(Login)`
déclenche deux avertissements `react-refresh/only-export-components`, et l'énoncé demande une
sortie de lint propre.

`App` n'a pas changé pour autant : il importe toujours `Login` et `CourseList` du même endroit.
Basculer `isLoggedIn` démonte l'un et monte l'autre, donc la console affiche les quatre lignes
attendues.

## `HOC/WithLogging.spec.js`

Le composant simulé de l'énoncé, `MockApp`, est enveloppé une fois en tête de fichier, puis réuti-
lisé par les tests.

| Test | Vérifie |
| --- | --- |
| `renders the wrapped component` | le titre `Hello from Mock App Component` |
| `logs that the wrapped component is mounted` | la ligne de montage |
| `logs that the wrapped component is going to unmount` | rien avant `unmount`, la ligne après |
| `names itself after the component it wraps` | `displayName` vaut `WithLogging(MockApp)` |
| `falls back to Component for an element with no name` | le repli sur `Component` |
| `passes its props down to the wrapped component` | les props traversent le HOC |

`console.log` est espionné dans `beforeEach` et rendu par `mockRestore()` dans `afterEach`, qui
appelle aussi `cleanup()` de Testing Library comme l'exige l'énoncé. Les messages sont comparés par
`expect.stringMatching(/…/i)`, insensible à la casse mais assez strict pour rejeter un autre texte.

## L'application

Le rendu ne change pas. Au chargement, la console affiche `Component Login is mounted` ; en passant
`isLoggedIn` à `true` dans `App.jsx`, elle ajoute `Component Login is going to unmount` puis
`Component CourseList is mounted`. Sous `StrictMode`, chaque cycle apparaît en double, c'est
attendu.

```bash
cd dashboard
npm install
npm run dev
npm test      # 12 suites, 66 tests
npm run lint  # aucune erreur, aucun avertissement
```
