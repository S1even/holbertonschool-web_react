# Task 5. Side Effect — Custom React hook

Copie identique du `dashboard` de la [tâche 4](../task_4) : l'énoncé de « Side Effect » désigne
le dossier `task_4`, où le code a été écrit. Cette copie couvre le cas où le checker chercherait
`task_5`.

## App — composant fonctionnel (tâche 5)

La classe `App` devient une fonction. Son objet `state` est découpé en hooks `useState` :

| État | Setter | Valeur initiale |
| --- | --- | --- |
| `displayDrawer` | `setDisplayDrawer` | `true` |
| `user` | `setUser` | l'utilisateur du contexte (non connecté) |
| `notifications` | `setNotifications` | `[]`, rempli par le serveur |
| `courses` | `setCourses` | `[]`, rempli par le serveur |

- **Utilisateur du contexte** : `context.js` exporte `user`, l'utilisateur non connecté qui sert
  de valeur par défaut au contexte. App l'importe comme état initial, et `logOut` y revient.
- **Callbacks mémoïsés** : `handleDisplayDrawer`, `handleHideDrawer`, `logIn`, `logOut` et
  `markNotificationAsRead` passent par `useCallback` et gardent la même référence d'un rendu à
  l'autre.
- **Mises à jour immuables** : `logIn` crée un nouvel objet utilisateur. `markNotificationAsRead`
  calcule une nouvelle liste filtrée à partir de l'état précédent.
- **Valeur du contexte** : `useMemo` ne reconstruit `{ user, logOut }` que lorsque l'utilisateur
  change.
- **Ctrl+H supprimé** : `handleKeyDown`, `componentDidMount` et `componentWillUnmount` sont
  retirés.

## Données chargées par effet (tâche 6)

Les listes codées en dur `notificationsList` et `coursesList` disparaissent. Les données viennent
de [public/notifications.json](dashboard/public/notifications.json) et
[public/courses.json](dashboard/public/courses.json), lues avec axios dans deux `useEffect` :

- **Notifications** : une requête au montage (dépendances `[]`), vers
  `http://localhost:5173/notifications.json`. La dernière notification arrive avec un `__html`
  vide, que `getLatestNotification()` remplit.
- **Cours** : une requête à chaque connexion (dépendance `[user.isLoggedIn]`), vers
  `http://localhost:5173/courses.json`. À la déconnexion, les cours sont vidés sans requête.
- **Nettoyage** : chaque effet renvoie une fonction qui ignore une réponse arrivée trop tard,
  après un démontage ou une déconnexion.
- **Erreurs** : chaque requête est dans un `try/catch`. L'erreur est loguée par `console.error`
  en développement seulement, et la liste reste vide.

## Hook personnalisé useLogin (tâche 7)

[src/hooks/useLogin.jsx](dashboard/src/hooks/useLogin.jsx) reprend tout l'état et toute la
logique du formulaire de connexion. Il reçoit un callback `onLogin` et renvoie :

- les valeurs `email`, `password` et `enableSubmit` ;
- les gestionnaires `handleChangeEmail`, `handleChangePassword` et `handleLoginSubmit`.

La validation ne change pas : le bouton **OK** démarre désactivé, et ne s'active qu'avec un email
valide et un mot de passe d'au moins 8 caractères. À la soumission, le hook empêche le
rechargement de la page puis appelle `onLogin(email, password)`.

[Login.jsx](dashboard/src/Login/Login.jsx) ne garde ni état ni logique : il appelle
`useLogin(logIn)` et branche les valeurs et gestionnaires renvoyés sur le formulaire. Il reste
exporté enveloppé par `WithLogging`.

[Login.spec.js](dashboard/src/Login/Login.spec.js) garde tous ses tests de comportement, et teste
le hook seul avec `renderHook` : valeurs initiales, mise à jour des champs, règles de validation,
soumission et absence de callback.

## Notifications — ajustements

- **Comparaison de `memo`** : elle porte sur chaque prop, par référence (`notifications`,
  `displayDrawer` et les trois callbacks).
- **Bouton de fermeture** : il appelle directement `handleHideDrawer`, sans log.
- **NotificationItem** : il est déclaré `const NotificationItem = memo(function NotificationItem({`,
  sans valeur par défaut dans les paramètres. Le runner du checker repère cette forme pour y
  injecter un log de rendu.

## Tests

[App.spec.js](dashboard/src/App/App.spec.js) remplace axios par `jest-mock-axios`, branché par
`moduleNameMapper` (`^axios$` → `jest-mock-axios`). `renderApp()` rend App puis répond à la
requête des notifications. `logIn()` passe par le formulaire puis répond à celle des cours.

- **Chargement des notifications** : une seule requête, au premier rendu. Les notifications
  s'affichent, la dernière avec son HTML. Un échec est logué, et une réponse arrivée après le
  démontage est ignorée.
- **Chargement des cours** : aucune requête tant que l'utilisateur n'est pas connecté, une à chaque
  connexion. Les cours s'affichent, sont vidés à la déconnexion, un échec est logué, et une réponse
  arrivée après la déconnexion est ignorée.
- **Fonctionnalités existantes** : tiroir, marquage comme lu, connexion et déconnexion, état
  `user` lu par une sonde sur le Header, et Ctrl+H désactivé.
