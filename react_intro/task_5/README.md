# Task 9. Reorganize the files

Reprise du `dashboard` de la tâche précédente, réorganisé par domaine fonctionnel.

## Arborescence

```
dashboard/
├── public/
│   └── favicon.ico
└── src/
    ├── App/
    │   ├── App.css
    │   ├── App.jsx
    │   └── App.spec.js
    ├── Notifications/
    │   ├── Notifications.css
    │   ├── Notifications.jsx
    │   └── Notifications.spec.js
    ├── assets/
    │   ├── close-button.png
    │   └── holberton-logo.jpg
    ├── utils/
    │   ├── utils.js
    │   └── utils.spec.js
    └── main.jsx
```

Les imports ont été mis à jour en conséquence : `main.jsx` pointe vers `./App/App.jsx`, et les
composants remontent d'un niveau pour atteindre les dossiers voisins (`../assets/…`,
`../utils/utils`). Les imports de CSS et ceux des fichiers de test restent relatifs à leur propre
dossier.

## Usage

```bash
cd dashboard
npm install
npm run dev     # serveur de développement
npm run lint    # ESLint
npm test        # Jest
```
