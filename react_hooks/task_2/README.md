# Task 2. Update the NotificationItem component

Copie du `dashboard` de la [tâche 1](../task_1) : Header, Footer et Login y sont déjà des
composants fonctionnels.

## NotificationItem — fonction mémoïsée

La classe `NotificationItem`, qui héritait de `PureComponent`, devient une fonction exportée
enveloppée par `memo`. Les deux font la même chose : une comparaison superficielle des props, et
pas de nouveau rendu tant qu'aucune ne change.

- **Props inchangées** : `id`, `type`, `html`, `value`, `markAsRead`.
- **Valeurs par défaut** : elles passent des `defaultProps` aux paramètres de la fonction, car
  React 18.3 signale `defaultProps` comme obsolète sur un composant fonctionnel.
- **Rendu identique** : un `li` avec `data-notification-type`, qui affiche `value` en texte ou
  `html` par `dangerouslySetInnerHTML`.
- **Clic** : appelle toujours `markAsRead(id)`, ce qui marque la notification comme lue.

## Tests

[NotificationItem.spec.js](dashboard/src/Notifications/NotificationItem.spec.js) vérifie le
rendu par type, le texte et le HTML, l'appel de `markAsRead` au clic, et que le composant est une
fonction enveloppée par `memo`.

Le test de mémoïsation espionnait `NotificationItem.prototype.render`, qui n'existe plus. Il
espionne maintenant `NotificationItem.type`, la fonction que `memo` enveloppe : rendre deux fois
les mêmes props ne l'appelle qu'une fois, et changer une prop l'appelle de nouveau.
