# Task 2. Update the Notifications Panel

Reprise du `dashboard` de la [tâche 1](../task_1). `src/Notifications/Notifications.css` est
supprimé et ses règles passent en utilitaires ; aucun des deux composants n'importe plus de
feuille de style.

## `src/main.css`

```css
@theme {
  --main-color: #e1003c;
  --default-notification-item: blue;
  --urgent-notification-item: red;
}
```

Ces trois variables ne portent **pas** le préfixe `--color-*`, contrairement à celles de la tâche
1. Tailwind n'en dérive donc aucun utilitaire : pas de `text-urgent-notification-item`.

C'est le sens de l'indice de l'énoncé (« Consider how to reference the new color variables within
Tailwind class names »). La v4 offre pour ça une syntaxe courte :

```
text-(--urgent-notification-item)   ≡   text-[var(--urgent-notification-item)]
```

Vérifié dans le CSS compilé :
`.text-\(--urgent-notification-item\){color:var(--urgent-notification-item)}`.

## `NotificationItem.jsx`

Le `style` en ligne disparaît au profit d'une classe :

| `type` | Classe |
| --- | --- |
| `urgent` | `text-(--urgent-notification-item)` |
| autre | `text-(--default-notification-item)` |

L'attribut `data-notification-type` reste : c'est lui que les tests interrogent.

## `Notifications.jsx`

```jsx
<div className="absolute top-[10px] right-5 w-1/4">
  <div className="notification-title text-right mb-1.5">Your notifications</div>
  <div className="notification-items border-2 border-dashed border-(--main-color) p-1.5">
```

- `w-1/4` → le panneau occupe un quart de la largeur de page
- `absolute top-[10px] right-5` → en haut à droite, comme le faisait `.root-notifications`
- `text-right` sur le titre, placé avant le panneau dans le flux
- `border-2 border-dashed border-(--main-color)` → la bordure tiretée demandée
- `p-1.5` → **6px** (`calc(0.25rem * 1.5)`), la classe demandée par l'énoncé

Les classes `notification-title` et `notification-items` sont conservées : les tests RTL
s'appuient dessus.

Le positionnement vivait dans `.root-notifications`, une règle de `Notifications.css`. Comme ce
fichier disparaît et que la `div` porteuse appartient à `App.jsx`, le placement est repris par le
conteneur du composant lui-même. `App.jsx` n'a donc pas à être restylé.

### Le preflight remet les listes à zéro

Tailwind normalise `ul` : ni puce, ni retrait. Les deux règles de l'ancien CSS
(`padding-left: 25px`, `margin-top: 8px`) et le `list-style` par défaut sont donc rétablis
explicitement — `list-disc mt-2 pl-6` — sinon la liste perdait ses puces au passage.

## `NotificationItem.spec.js`

Les deux assertions `toHaveStyle({ color: ... })` sont retirées, comme demandé : la couleur ne
vient plus d'un `style` en ligne mais d'une classe, que Jest ne résout pas. Les tests
correspondants restent, réduits à ce qui est réellement vérifiable en unitaire — la présence de
l'attribut `data-notification-type`.

## `App.jsx` : rendre le panneau visible

Même piège qu'en [tâche 1](../task_1) avec `isLoggedIn`. `displayDrawer` vaut `false` par défaut
et `App` ne le passait pas : le panneau n'existait jamais dans le DOM de l'app servie, donc rien
à mesurer pour un test de bout en bout.

Le correctif va dans `App.jsx` et non dans les `defaultProps`, car `Notifications.spec.js` vérifie
explicitement que le tiroir reste fermé sans la prop.

```jsx
<Notifications notifications={notificationsList} displayDrawer />
```

## Vérification

Mesuré dans un Chrome headless, à 1280px de large :

| Contrôle | Attendu | Obtenu |
| --- | --- | --- |
| Largeur du panneau | ~25% | 320px sur 1280px |
| Position | haut / droite | `absolute`, top 10px, right 20px |
| Alignement du titre | à droite | `right` |
| Bordure | tiretée, `--main-color` | `2px dashed rgb(225, 0, 60)` |
| Padding | 6px | `6px` |
| Item `default` | bleu | `rgb(0, 0, 255)` |
| Item `urgent` | rouge | `rgb(255, 0, 0)` |
| Panneau vide | même cadre | 320px, même bordure, même padding |

```bash
cd dashboard
npm install
npm run dev
npm test      # 12 suites, 69 tests
npm run lint  # aucune erreur
```
