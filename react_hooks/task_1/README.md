# Task 1. Convert Login component

Copie du `dashboard` de la [tâche 0](../task_0) : Header et Footer y lisent déjà le contexte par
`useContext`.

## Login — composant fonctionnel

La classe `Login` devient une fonction, toujours exportée enveloppée par `WithLogging`.

- **État** : `useState` crée `enableSubmit` / `setEnableSubmit` (initialisé à `false`) et
  `formData` / `setFormData` (initialisé à `{ email: '', password: '' }`).
- **`handleChangeEmail` et `handleChangePassword`** : lisent la valeur du champ, mettent à jour
  `formData` en conservant l'autre champ, puis recalculent `enableSubmit`.
- **Validation inchangée** : le bouton **OK** n'est activé qu'avec un email valide et un mot de
  passe d'au moins 8 caractères.
- **`handleLoginSubmit`** : empêche toujours la soumission native du formulaire, puis appelle la
  prop `logIn` avec l'email et le mot de passe saisis.

## Tests

[Login.spec.js](dashboard/src/Login/Login.spec.js) vérifie les champs et leurs étiquettes,
l'activation du bouton selon la validation, la synchronisation des champs, l'absence de
rechargement à la soumission, l'appel de `logIn` avec les dernières valeurs saisies, des champs
vides au montage, et l'enveloppe `WithLogging`.
