# Task 3. Reusable comments & specialization

Reprise du `dashboard` de la [tâche 2](../task_2). Deux composants nouveaux, dans
`src/BodySection/`, qui ne connaissent pas leur contenu : ils l'enveloppent.

## `BodySection.jsx`

Une classe qui rend un `div.bodySection` contenant un `h2` porteur de la prop `title`, puis
`children` — dans cet ordre. C'est de la **containment** : le composant ne sait rien de ce qu'on
lui passe, il se contente de l'afficher.

```jsx
<BodySection title="test">
  <p>test</p>
</BodySection>
```

donne

```html
<div class="bodySection">
  <h2>test</h2>
  <p>test</p>
</div>
```

`defaultProps` pose `title` à la chaîne vide et `children` à `null`, pour qu'un rendu sans prop
tienne debout.

## `BodySectionWithMarginBottom.jsx`

Une **spécialisation** du précédent : un `div.bodySectionWithMargin` qui enveloppe un
`BodySection`. Toutes les props lui sont transmises d'un coup par `{...this.props}`, `children`
compris, donc le composant reste lui aussi agnostique.

`BodySectionWithMarginBottom.css` porte le seul style de la tâche, une marge basse de `40px` sur
`.bodySectionWithMargin`.

## Les tests

`BodySection.spec.js` :

| Test | Vérifie |
| --- | --- |
| `renders a heading holding the title prop` | le `h2` et le conteneur `.bodySection` |
| `renders the single child it is given` | le `p` passé en enfant |
| `renders any number of children` | trois enfants, dans l'ordre, le `h2` en tête |
| `renders without children` | le composant tient sans enfant |

`BodySectionWithMarginBottom.spec.js` :

| Test | Vérifie |
| --- | --- |
| `renders a div with the class bodySectionWithMargin` | le `div` et sa classe |
| `renders the BodySection component inside that div` | `.bodySection` imbriqué dedans |
| `hands the title and the children down to it` | le titre et l'enfant arrivent bien en bas |

## Tâche 4 — Use the new components

La tâche suivante de l'énoncé se joue dans ce même dossier. `App` branche les deux composants :

- `CourseList` est enveloppé par un `BodySectionWithMarginBottom` titré `Course list` ;
- `Login` par un autre, titré `Log in to continue` ;
- un `BodySection` titré `News from the School` ferme le corps de page, avec un paragraphe
  `Holberton School News goes here`.

Le bloc d'actualités est en dehors du ternaire `isLoggedIn` : il s'affiche dans les deux états.

Trois tests s'ajoutent à `App.spec.js` : le bloc d'actualités par défaut, puis chacune des deux
enveloppes. Le titre est cherché par `getByRole('heading', { name: /…/i })` sans préciser le
niveau, et les textes par des regex insensibles à la casse.

Le style est vérifié jusqu'au bout : après `npx vite build`, le CSS produit contient bien
`.bodySectionWithMargin{margin-bottom:40px}`.

Validation avant de pousser — implémentations de substitution jouées à leur place :

| Version jouée | Attendu | Obtenu |
| --- | --- | --- |
| composants fonctionnels équivalents | tout passe | 7 réussis |
| `h3` au lieu de `h2` | des échecs | 3 échecs |
| `children` ignorés | des échecs | 3 échecs |
| classe `bodySectionMargin` sur l'enveloppe | des échecs | 2 échecs |

## L'application

Le rendu ne change pas.

```bash
cd dashboard
npm install
npm run dev
npm test      # 11 suites, 60 tests
npm run lint  # aucune erreur
```
