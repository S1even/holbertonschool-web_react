# Tasks 3 à 5

Reprise du `dashboard` de la tâche précédente : formulaire de connexion, tests associés, puis
enrichissement du panneau de notifications.

## Ajouts

Dans le `div.App-body` de [dashboard/src/App.jsx](dashboard/src/App.jsx), sous le paragraphe
`Login to access the full dashboard` :

- un `label` + un `input` pour l'adresse e-mail
- un `label` + un `input` pour le mot de passe
- un `button` portant le texte `OK`

Chaque `label` est relié à son champ par `htmlFor` / `id`, de sorte qu'un clic sur le libellé
donne le focus au champ correspondant.

[dashboard/src/App.spec.js](dashboard/src/App.spec.js) complète la suite de la tâche 1 : deux
champs de saisie, deux libellés `Email` et `Password`, et le bouton `OK`. Les assertions sont
insensibles à la casse et indépendantes de l'ordre des champs.

## Task 5. Update the Notifications

- [dashboard/src/utils.js](dashboard/src/utils.js) — `getLatestNotification()` renvoie
  `<strong>Urgent requirement</strong> - complete by EOD`.
- [dashboard/src/Notifications.jsx](dashboard/src/Notifications.jsx) — un bouton `aria-label="Close"`
  stylé en ligne (`float: right`), contenant l'icône de fermeture, qui journalise
  `Close button has been clicked` au clic ; puis une liste de trois notifications portant un
  attribut `data-priority` (`default`, `urgent`, `urgent`), la dernière étant injectée via
  `dangerouslySetInnerHTML`.
- [dashboard/src/Notifications.css](dashboard/src/Notifications.css) — priorité `default` en bleu,
  `urgent` en rouge.

L'énoncé mentionne `close-icon.png`, mais l'image livrée par la tâche 0 s'appelle
`close-button.png` : c'est ce fichier, réellement présent dans `src/assets/`, qui est importé.

## Usage

```bash
cd dashboard
npm install
npm run dev     # serveur de développement
npm run lint    # ESLint
npm test        # Jest
```
