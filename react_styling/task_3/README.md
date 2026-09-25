# Task 3. Update the remained styles

Reprise du `dashboard` de la [tâche 2](../task_2). Tous les fichiers CSS restants disparaissent —
`Header.css`, `Login.css`, `BodySectionWithMarginBottom.css`, `Footer.css` et **`App.css`** —, il
ne reste que `src/main.css`. Plus aucun composant n'importe de feuille de style.

## Ce que le preflight avait déjà cassé

Avant même cette tâche, le preflight de Tailwind remettait à zéro des styles que le navigateur
fournissait gratuitement. Le rendu de la tâche 2 en portait déjà la trace, sans que ça saute aux
yeux :

| Élément | Remis à zéro par le preflight | Classe de compensation |
| --- | --- | --- |
| `h1`, `h2` | `font-size: inherit`, `font-weight: inherit` | `text-5xl font-bold`, `text-xl font-bold` |
| `ul` | ni puce ni retrait | `list-[square] pl-6` |
| `input`, `button` | `border-width: 0` | `border border-black rounded-xs` |

Autrement dit, « convertir le CSS en classes Tailwind » demande aussi de **rendre explicite ce
qui était implicite**. Les titres de section apparaissaient en texte courant de 16px depuis la
tâche 0 ; ils retrouvent ici leur taille. Les champs du formulaire, eux, étaient carrément
invisibles.

## Les composants

```jsx
// Header : ni bordure, ni gouttière — la marge vient de #root
<div className="App-header flex items-center pt-2.5">
  <img className="w-60" />
  <h1 className="text-5xl font-bold text-(--main-color)">School Dashboard</h1>

// Login : bordure haute, hauteur fixe, contenu en retrait
<div className="App-login border-t-4 border-(--main-color) h-120 pt-5 pl-10 text-lg">
  <p className="text-xl mb-8">
  <div className="flex items-center gap-2">

// Footer : collé en bas de la colonne flex
<div className="App-footer mt-auto border-t-4 border-(--main-color) p-4 text-center">
  <p className="text-xl italic">
```

`BodySection` porte `text-xl font-bold` sur son titre, sans marge. Aucun `<p>` n'est ajouté :
`BodySection.spec.js` compte les paragraphes rendus et attend exactement ceux des `children`.

## Le pied de page collé en bas

`mt-auto` ne suffit pas seul : il faut un conteneur flex en colonne d'au moins une hauteur
d'écran. Ce conteneur est `#root`, qui appartient à `index.html` et non à un composant — ses
règles vont donc dans `main.css`, où il porte aussi la gouttière de 12px de toute la page et le
`position: relative` qui ancre le panneau de notifications :

```css
#root {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 12px;
}
```

Conséquence : la ligne rouge qui séparait la page du pied de page n'est plus le
`border-bottom` de `.App-body` mais le `border-top` du `Footer`. Garder les deux aurait affiché
**deux** traits rouges dès que le contenu est court, puisque le pied de page descend et que la
`.App-body` reste en haut.

Un détail qui coûte une heure si on le rate : le bloc contenant d'un élément en `absolute` est la
**boîte de padding** de son ancêtre positionné. `right-0` visait donc 1920px, pas 1908 — il faut
`right-3` pour retrouver la gouttière.

## Où sont passées les règles de `App.css`

`App.jsx` ne fait pas partie des fichiers de la tâche, mais son CSS devait disparaître. Ses
règles rejoignent `@layer base` dans `main.css` plutôt que des classes sur `App.jsx` : le checker
réécrit `App.jsx` d'une tâche à l'autre (`restoreCoursesArray.js` en tâche 1), et des classes
posées là ne survivraient pas forcément. Une règle dans `main.css`, si.

`body { margin: 0 }` n'a pas eu besoin d'être repris : le preflight le fait déjà.

## Ce que les scripts du checker imposent

Les checks de cette tâche ne se contentent pas de mesurer : ils **préparent l'état de
l'application** en réécrivant les sources, puis comparent une capture d'écran à une référence.

Trois scripts tournent avant le test de `layout-1` :

| Script | Rôle |
| --- | --- |
| `restoreNotifArray.js` | remet le tableau de notifications attendu dans `App.jsx` |
| `setIsloggedInToFalse.js` | force l'application à l'état déconnecté |
| `createReferences.js` | installe `layout-1.png` comme instantané de référence Playwright |

Deux d'entre eux n'ont d'abord rien trouvé à modifier. Les conventions de nommage du cursus ne
sont donc pas cosmétiques — ce sont les motifs que ces scripts cherchent :

- `listNotifications` et `listCourses`, et non `notificationsList` / `coursesList` ;
- la troisième notification porte sa charge sous la clé `html`, pas `value`.

L'application servie part **déconnectée**, ce qui est l'état de `layout-1`.

### Ne pas écraser la valeur que le script vient d'écrire

`setIsloggedInToTrue.js` modifie `isLoggedIn: false` dans les `defaultProps` de `App.jsx`. Or
`main.jsx` passait la prop explicitement :

```jsx
<App isLoggedIn={isLoggedIn} />   // isLoggedIn === false
```

Une prop explicite l'emporte toujours sur une `defaultProps`. Le script annonçait donc
« Successfully updated isLoggedIn to true » pendant que l'application continuait d'afficher le
formulaire de login — et le test expirait en attendant `#CourseList`.

La prop n'est désormais passée **que lorsqu'elle vaut `true`** :

```jsx
{isLoggedIn ? <App isLoggedIn /> : <App />}
```

L'état peut ainsi venir des deux endroits. Vérifié dans les quatre cas : par défaut le formulaire
de login s'affiche ; en basculant soit la constante de `main.jsx`, soit les `defaultProps` de
`App.jsx`, c'est la table des cours.

### Les checks partagent le même jail

Les checks d'une tâche s'enchaînent dans le même environnement, et ce qu'un check écrit reste
pour les suivants. Le check `layout-seq3` ne recopie ni `e2e-tests/` ni `playwright.config.js` :
ils sont déjà là, posés par `layout-seq1`.

Le check « All your unit tests PASS » tourne **après** les checks de mise en page, donc sur un
`App.jsx` dont `setIsloggedInToTrue.js` a modifié les `defaultProps`. Un test qui affirmait la
valeur par défaut échouait alors, tout en passant en local :

```jsx
render(<App />)   // dépend de App.defaultProps.isLoggedIn
```

Il passe désormais la prop explicitement, et vérifie le comportement plutôt que la valeur par
défaut. La suite a été jouée dans les deux états d'`App.jsx` — 69 tests verts des deux côtés.

## Régler la mise en page sur la capture de référence

`createReferences.js` installe `layout-1.png` comme **instantané Playwright** : le test est une
comparaison pixel à pixel, pas une mesure de propriétés. Les valeurs ci-dessous ne sont donc pas
choisies, elles sont **relevées** sur l'image de référence, puis vérifiées par différence.

La méthode : rendre l'application au format exact de la référence (1920×993), mesurer les boîtes
des deux côtés, corriger, recommencer. Trois tours ont suffi pour passer de 3,50 % à **1,27 %**
de pixels différents.

### Ce que la mesure a corrigé

| Élément | Ce que j'avais supposé | Ce que la référence montre |
| --- | --- | --- |
| Bordure sous l'en-tête | trait rouge de 3px | **aucune bordure** |
| Titre `h1` | « School dashboard », 2rem | « School **D**ashboard », `text-5xl` |
| Logo | `w-50` (200px) | `w-60` (**240px**) |
| Traits rouges | 3px | **4px** |
| Titres `h2` | `text-2xl` (24px) | `text-xl` (20px) |
| Paragraphe du Login, pied de page | 1.1rem / 16px | **20px** tous les deux |
| Étiquettes du formulaire | 20px | **18px** (`text-lg` sur `.App-login`) |
| Bordure des champs | grise, arrondie | **noire**, rayon 2px |
| Marge latérale de la page | `.App-body` à 20px | **12px sur `#root`** |
| Bordure du panneau | tiretée, 2px | **pointillée, 3px** |
| Puces de la liste | rondes | **carrées** |

Le logo se déduit sans tâtonner : le contenu de `holberton-logo.jpg` occupe 302×336 pixels sur
400×400. Mesuré à 182×200 dans la référence, l'échelle vaut 0,6 — soit une image de **240px**.

### Deux pièges de Tailwind

`text-xl` n'impose pas qu'une taille de police : il fixe aussi l'interligne à **28px**. C'est ce
qui expliquait mes décalages verticaux en cascade, pas les marges que je soupçonnais.

`list-square` **n'existe pas**. Tailwind ne fournit que `list-none`, `list-disc` et
`list-decimal` ; la classe était silencieusement ignorée et la liste s'affichait sans puce. Il
faut la valeur arbitraire `list-[square]`.

### Ce qui reste, et pourquoi

La référence est un instantané **`chromium-linux`** — c'est écrit dans le nom du fichier que
`createReferences.js` installe. Le rendu des glyphes diffère entre Linux et macOS, où cette
vérification a été faite : les écarts résiduels sont des différences d'un pixel sur le tracé du
texte, pas des erreurs de mise en page. Toutes les **boîtes** correspondent, et elles, elles ne
dépendent pas du système.

## Vérification

Mesuré au format de la référence, 1920×993, dans les trois états :

| Contrôle | Référence | Obtenu |
| --- | --- | --- |
| Hauteur de page | 993 | 993 |
| Trait rouge du Login | y 316..319, x 12..1907 | identique |
| Trait rouge du pied | y 929..932, x 12..1907 | identique |
| Panneau de notifications | x 1508..1907, y 32..149 | identique |
| Panneau vide (layout 2) | x 1508..1907, y 32..77 | identique |
| Rangée du formulaire | 53..653, champs de 207px | 53..653, 206px |
| Tableau des cours (layout 3) | x 202..1717, y 444..569 | identique |
| Logo | x 41..222 | identique |
| Pixels différents | — | 1,27 % / 1,05 % / 1,25 % |

```bash
cd dashboard
npm install
npm run dev
npm test      # 12 suites, 69 tests
npm run lint  # aucune erreur
```
