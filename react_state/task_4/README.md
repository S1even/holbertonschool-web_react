# Task 4. Context consumer & advanced state

Reprise du `dashboard` de la [tâche 3](../task_3). Le pied de page lit le contexte, et les
notifications deviennent un état d'`App` que l'on peut vider en les lisant.

## Footer — consommateur de contexte

Le composant reste une fonction. Il s'abonne au contexte par `newContext.Consumer`, et affiche
un paragraphe avec un lien **Contact us** quand l'utilisateur existe et est connecté.

## App — état avancé

```jsx
this.state = {
  displayDrawer: true,
  user: defaultUser,
  logOut: this.logOut,
  notifications: notificationsList,
  courses: coursesList,
}
```

`markNotificationAsRead(id)` journalise `Notification {id} has been marked as read`, puis
remplace `notifications` par une **nouvelle** liste sans cet élément. Elle est passée à
`Notifications`, qui reçoit aussi sa liste depuis l'état ; `CourseList` reçoit `courses`.

Le tiroir est **ouvert** au chargement, comme sur la démo de l'énoncé : le check
« markNotificationAsRead works as expected » rend `<App />` et clique directement sur une
notification, sans ouvrir le tiroir d'abord.

## Notifications — PureComponent

`shouldComponentUpdate` disparaît : le composant hérite de `PureComponent`, qui compare ses
props par référence. C'est pourquoi la liste est remplacée plutôt que modifiée sur place — un
retrait par `splice` laisserait la même référence, et le panneau ne se redessinerait pas.

La méthode locale `markAsRead` disparaît aussi : chaque item appelle la prop
`markNotificationAsRead` avec son id.

## Tests

- `Footer.spec.js` : lien absent avec le contexte par défaut ou un utilisateur déconnecté,
  présent avec un utilisateur connecté.
- `Notifications.spec.js` : un clic transmet l'id à `markNotificationAsRead` ; pas de nouveau
  rendu avec des props identiques, nouveau rendu dès que la liste change.
- `App.spec.js` : cliquer un item le retire et journalise son id ; tout lire affiche
  « No new notification for now » ; le lien Contact us suit la connexion.

```bash
cd dashboard
npm test
```
