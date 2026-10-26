# Task 2. Context

Reprise du `dashboard` de la [tâche 1](../task_1). La connexion quitte les props d'`App` : elle
devient un état d'`App`, partagé par un contexte React.

## Le contexte — `src/Context/context.js`

```js
const user = { email: '', password: '', isLoggedIn: false }
const logOut = () => {}

const newContext = createContext({ user, logOut })
export default newContext
```

Seul `newContext` est exporté, par défaut.

## App

- État : `{ displayDrawer, user, logOut }`, où `user` a la forme de l'utilisateur du contexte et
  `logOut` référence la méthode `logOut` d'App.
- `logIn(email, password)` remplace `user` par `{ email, password, isLoggedIn: true }` ;
  `logOut()` le remet à sa valeur par défaut.
- Les props `isLoggedIn` et `logOut` disparaissent : `render()` lit `user.isLoggedIn`, et
  Ctrl+H appelle le `logOut` de l'état.
- `Login` reçoit `logIn`, `email` et `password`.

### Valeur du Provider

Le Provider compare sa `value` par référence. Écrire `value={{ user, logOut }}` créerait un
objet neuf à chaque rendu — chaque ouverture du tiroir de notifications ferait re-rendre tous
les consommateurs. `getContextValue()` garde donc l'objet en cache et ne le reconstruit que
lorsque `user` ou `logOut` change.

## Login

- L'état ne contient plus `isLoggedIn` ; `email` et `password` démarrent sur les props
  (chaînes vides par défaut).
- `handleLoginSubmit` annule la soumission puis appelle `this.props.logIn(email, password)`.

## Tests

- `Login.spec.js` : `logIn` est appelé avec l'email et le mot de passe saisis, jamais tant que
  le bouton est désactivé, et les props pré-remplissent les champs.
- `App.spec.js` : les tests qui passaient `isLoggedIn` ou `logOut` en props se connectent
  désormais par le formulaire ; Ctrl+H ramène au formulaire de login.

```bash
cd dashboard
npm test
```
