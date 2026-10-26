# Task 1. Controlled components and state callback

Reprise du `dashboard` de la [tâche 0](../task_0). `Login` devient un composant de classe qui
gère son formulaire.

## État local

Toutes les valeurs par défaut sont posées dans le constructeur :

```jsx
this.state = { isLoggedIn: false, email: '', password: '', enableSubmit: false }
```

## Composants contrôlés

Les deux champs lisent leur `value` dans l'état et le mettent à jour à chaque frappe via
`handleChangeEmail` et `handleChangePassword`. Chaque méthode recalcule `enableSubmit` dans le
même `setState` (forme fonctionnelle, pour lire l'autre champ à jour) :

- l'email doit correspondre à `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` ;
- le mot de passe doit faire au moins 8 caractères.

## Soumission

Les champs sont dans un `<form>` dont le bouton est un `<input type="submit" value="OK">`,
désactivé tant que `enableSubmit` vaut `false`. `handleLoginSubmit` appelle
`event.preventDefault()` — pas de rechargement — puis passe `isLoggedIn` à `true`. L'affichage de
la liste des cours viendra à la tâche suivante.

## Tests

`Login.spec.js` vérifie que le bouton est désactivé par défaut, qu'il ne s'active qu'avec un
email valide **et** un mot de passe de 8 caractères, que les champs suivent la saisie, et que la
soumission est bien annulée côté navigateur.

```bash
cd dashboard
npm test
```
