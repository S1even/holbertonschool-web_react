# Task 8. Deploy to a GitHub page

Reprise du `dashboard` de la tâche précédente, préparé pour un déploiement sur GitHub Pages
depuis la branche `gh-pages`.

## Configuration du déploiement

- [dashboard/vite.config.js](dashboard/vite.config.js) — `base: '/holbertonschool-web_react/'`.
  Le site étant servi depuis un sous-répertoire et non depuis la racine du domaine, sans cette
  option les scripts et feuilles de style seraient demandés à `/assets/…` et la page s'afficherait
  vide.
- `package.json` — scripts `predeploy` (build) et `deploy` (`gh-pages -d dist`).

L'URL publique est enregistrée dans
[dashboard/holberton-dashboard.txt](dashboard/holberton-dashboard.txt).

## Déployer

```bash
cd dashboard
npm install
npm run deploy   # build puis publication sur la branche gh-pages
```

La source des pages doit être réglée sur la branche `gh-pages` dans les réglages GitHub du dépôt.
