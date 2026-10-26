# Task 0. Adding a local state for notifications

Reprise du `dashboard` de [react_styling/task_5](../../react_styling/task_5). L'ouverture du
tiroir de notifications devient un état local d'`App`.

## App

```jsx
this.state = { displayDrawer: false }

handleDisplayDrawer() { this.setState({ displayDrawer: true }) }
handleHideDrawer()    { this.setState({ displayDrawer: false }) }
```

Les deux méthodes sont liées dans le constructeur, puis passées à `Notifications` avec
`displayDrawer`. Le tiroir est fermé au chargement : le titre rebondit jusqu'au premier clic.

## Notifications

- un clic sur « Your notifications » appelle `handleDisplayDrawer` ;
- un clic sur le bouton de fermeture appelle `handleHideDrawer` (le message de console est
  conservé) ;
- `shouldComponentUpdate` laisse passer un changement de `displayDrawer`, sinon le tiroir ne se
  redessinerait jamais.

Les deux callbacks ont une valeur par défaut vide : le composant reste utilisable seul.

## Tests

- `Notifications.spec.js` passe des spies (`jest.fn()`) en props et vérifie qu'un clic sur le
  titre et sur le bouton de fermeture les appelle ;
- `App.spec.js` vérifie l'aller-retour complet dans la page rendue : ouverture, puis fermeture.

```bash
cd dashboard
npm test
```
