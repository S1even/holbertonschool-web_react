# Task 6. State Symphony

Copie du `dashboard` de la [tâche 5](../task_5). Le Context API laisse place à un reducer : tout
l'état d'App passe par `useReducer`, et les enfants le reçoivent par leurs props.

## appReducer

[src/App/appReducer.js](dashboard/src/App/appReducer.js) exporte trois éléments :

- **`APP_ACTIONS`** : `LOGIN`, `LOGOUT`, `TOGGLE_DRAWER`, `MARK_NOTIFICATION_READ`,
  `SET_NOTIFICATIONS` et `SET_COURSES`.
- **`initialState`** : `displayDrawer: true`, un utilisateur non connecté
  (`{ email: '', password: '', isLoggedIn: false }`), `notifications: []` et `courses: []`.
- **`appReducer(state = initialState, action)`** : un `switch` sur `action.type`. Chaque cas
  renvoie un nouvel objet, et une action inconnue renvoie l'état tel quel.

| Action | Payload | Effet |
| --- | --- | --- |
| `LOGIN` | `{ email, password }` | connecte l'utilisateur |
| `LOGOUT` | — | revient à l'utilisateur non connecté et vide les cours |
| `TOGGLE_DRAWER` | — | inverse le tiroir : ouvert, il se ferme ; fermé, il s'ouvre |
| `MARK_NOTIFICATION_READ` | `id` | retire la notification de la liste |
| `SET_NOTIFICATIONS` | liste | remplace les notifications |
| `SET_COURSES` | liste | remplace les cours |

## App

- **Un seul état** : `useReducer(appReducer, initialState)` remplace les `useState`.
- **Callbacks** : `handleDisplayDrawer`, `handleHideDrawer`, `logIn`, `logOut` et
  `markNotificationAsRead` envoient les actions correspondantes. Ils restent mémoïsés par
  `useCallback`, car `dispatch` garde la même référence.
- **Tiroir** : comme dans la solution du staff, `handleDisplayDrawer` et `handleHideDrawer`
  envoient tous deux `TOGGLE_DRAWER`. Un clic sur « Your notifications » referme donc un tiroir
  déjà ouvert, et le rouvre au clic suivant.
- **Tiroir vide** : tant que le serveur n'a pas répondu, ou une fois tout lu, le tiroir affiche
  « No new notifications for now », au pluriel comme dans la solution du staff.
- **Données** : les deux effets envoient `SET_NOTIFICATIONS` et `SET_COURSES` avec les données
  reçues par axios. Leur nettoyage ignore toujours une réponse arrivée trop tard.
- **Plus de contexte** : le Provider est retiré, et `src/Context/context.js` est supprimé.
  Header reçoit `user` et `logOut`, Footer reçoit `user`.

## Header et Footer

- **[Header](dashboard/src/Header/Header.jsx)** : `Header({ user, logOut })` affiche
  `Welcome <email> (logout)` pour un utilisateur connecté. L'email est dans un `<b>`, comme dans
  la solution du staff, ce qui permet de le retrouver tel quel. Le lien appelle `logOut`.
- **[Footer](dashboard/src/Footer/Footer.jsx)** : `Footer({ user })` affiche le lien **Contact
  us** quand l'utilisateur existe et est connecté.
- **Sans props** : les deux composants s'affichent sans erreur, sans section de déconnexion ni
  lien de contact.

## Tests

- **[Header.spec.js](dashboard/src/Header/Header.spec.js) et
  [Footer.spec.js](dashboard/src/Footer/Footer.spec.js)** : ils passent l'utilisateur et `logOut`
  en props, à la place d'un Provider.
- **[App.spec.js](dashboard/src/App/App.spec.js)** : il teste le reducer à travers l'interface.
  La sonde sur le Header lit désormais la prop `user`. Un bloc vérifie l'état initial, puis
  l'effet de chaque action : connexion visible dans le Header et le Footer, déconnexion qui vide
  les cours, tiroir fermé puis rouvert, notification lue sans modifier la réponse du serveur, et
  cours affichés.
