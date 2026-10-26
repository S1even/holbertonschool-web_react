# Task 3. Log Out implementation

Reprise du `dashboard` de la [tâche 2](../task_2). Le Header lit le contexte et permet de se
déconnecter.

## Header

`contextType` n'existe que pour les composants de classe : `Header` en devient un.

```jsx
class Header extends Component {
  static contextType = newContext
  ...
}
```

Sous l'en-tête, une section `#logoutSection` n'apparaît que si `this.context.user.isLoggedIn`
vaut `true`. Elle affiche « Welcome *email* (logout) » ; le lien `logout` annule sa navigation
puis appelle `this.context.logOut()`.

Hors de tout Provider, `this.context` vaut la valeur par défaut du contexte — un visiteur non
connecté —, la section reste donc absente.

## App

Rien à ajouter : `logOut` est déjà dans l'état et transmis par le Provider depuis la tâche 2.
L'état (`displayDrawer`, `user`, `logOut`) et les props passées sont tous utilisés.

## Tests

- `Header.spec.js` : section absente avec le contexte par défaut, présente sous un Provider
  dont l'utilisateur est connecté, et clic sur `logout` → le spy `logOut` est appelé.
- `App.spec.js` : tout passe par l'état — connexion par le formulaire, puis vérification que la
  section de bienvenue apparaît, que `logout` ramène au formulaire vide et que la liste des
  cours disparaît.

```bash
cd dashboard
npm test
```
