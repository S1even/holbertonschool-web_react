# Task 2. Handling Events

Reprise du `dashboard` de la [tâche 1](../task_1). `Notifications` et `NotificationItem` passent en
composants de classe, et cliquer une notification la marque comme lue.

## `Notifications.jsx`

La fonction devient `class Notifications extends Component`. Les deux props gardent leur valeur par
défaut, désormais dans `Notifications.defaultProps` : `displayDrawer` à `false` et `notifications`
à `[]`.

Nouvelle méthode `markAsRead(id)`, liée dans le `constructor` pour ne pas dépendre de la façon dont
l'enfant l'appelle :

```jsx
markAsRead(id) {
  console.log(`Notification ${id} has been marked as read`)
}
```

Chaque `NotificationItem` reçoit deux props de plus : son `id`, et `markAsRead`.

## `NotificationItem.jsx`

Même bascule en classe. Le `li` porte maintenant `onClick={() => markAsRead(id)}`, dans les deux
branches du rendu — texte simple comme contenu balisé.

`NotificationItem.defaultProps` couvre les cinq props, dont `markAsRead: () => {}`. Un item rendu
seul, sans gestionnaire, reste donc cliquable sans planter.

## Les tests

Dans `NotificationItem.spec.js`, deux tests : `markAsRead` reçoit bien l'`id` de l'item au clic,
une seule fois, et le second vérifie la même chose sur un item porteur de balises, l'autre branche
du rendu.

Dans `Notifications.spec.js`, un test clique le premier puis le deuxième `li` et attend
`Notification 1 has been marked as read` puis `Notification 2 …`. Les ids viennent de la prop, donc
ils commencent à 1. `console.log` est espionné par `jest.spyOn(…).mockImplementation()` et rendu par
`mockRestore()` à la fin de chaque test qui l'utilise.

Les messages sont comparés par `expect.stringMatching(/…/i)` : une fixture écrite dans une autre
casse passe, une fixture qui journalise autre chose échoue.

Une assertion a été retirée au passage. L'état vide du tiroir ne vérifie plus l'absence du titre
`Here is the list of notifications` : certaines implémentations valides affichent ce titre dès que
le tiroir est ouvert, et le test échouait sur du code correct. Restent le texte
`No new notification for now` et l'absence de `li`.

Validation avant de pousser — composants remplacés tour à tour par ceux d'une autre solution :

| Version jouée | Attendu | Obtenu |
| --- | --- | --- |
| implémentation tierce complète | tout passe | 24 réussis |
| la même, journalisant `has been read` | un échec | 1 échec |
| la même, `li` sans `onClick` | des échecs | 3 échecs |

## L'application

Le rendu ne change pas. Tiroir ouvert, un clic sur une notification écrit son id dans la console du
navigateur.

```bash
cd dashboard
npm install
npm run dev
npm test      # 9 suites, 50 tests
npm run lint  # aucune erreur
```
