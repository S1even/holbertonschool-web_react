# Task 3. Update the Notifications component

Copie du `dashboard` de la [tâche 2](../task_2) : `NotificationItem` y est déjà une fonction
enveloppée par `memo`.

## Notifications — fonction mémoïsée avec comparaison

La classe `Notifications`, qui héritait de `PureComponent`, devient une fonction exportée par
`memo(Notifications, areEqual)`. React ne la redessine que lorsque `areEqual` renvoie `false`.

```js
const areEqual = (prevProps, nextProps) =>
  prevProps.displayDrawer === nextProps.displayDrawer &&
  (prevProps.notifications ?? []).length ===
    (nextProps.notifications ?? []).length
```

- **Ce qui déclenche un rendu** : l'ouverture ou la fermeture du tiroir, et l'ajout ou le retrait
  d'une notification. Marquer une notification comme lue la retire de la liste d'App, la longueur
  suffit donc à suivre l'état.
- **Ce qui n'en déclenche pas** : une nouvelle liste de même longueur, ou de nouveaux callbacks.
  App lie ses méthodes une seule fois dans son constructeur, leur référence ne change donc pas.
- **Props et valeurs par défaut** : inchangées, passées en paramètres de la fonction.
  `displayDrawer = true` garde sa forme littérale, que les scripts du checker réécrivent.
- **Fonctionnalités conservées** : titre rebondissant, bouton de fermeture qui logue puis appelle
  `handleHideDrawer`, clic sur le titre qui appelle `handleDisplayDrawer`, et clic sur un item qui
  appelle `markNotificationAsRead(id)`.

## Tests

[Notifications.spec.js](dashboard/src/Notifications/Notifications.spec.js) vérifie toujours le
rendu du tiroir et ses callbacks. Les tests de rendu espionnent désormais `Notifications.type`, la
fonction que `memo` enveloppe, à la place de `prototype.render`. Ils vérifient :

- l'absence de rendu avec les mêmes props, une liste de même longueur ou de nouveaux callbacks ;
- un nouveau rendu quand la liste raccourcit ou s'allonge, ou quand le tiroir s'ouvre ou se ferme ;
- que le composant est une fonction enveloppée par `memo`, avec une comparaison personnalisée.
