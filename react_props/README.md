# React props

Suite du projet `react_intro`. Le dashboard y est découpé en composants réutilisables, puis
paramétré par des `props`.

| Tâche | Sujet |
| --- | --- |
| [task_0](task_0) | Basic components — extraction de `Header`, `Login` et `Footer` depuis `App` |
| [task_1](task_1) | Write the tests for each component — tests unitaires de `Header`, `Login` et `Footer` |
| [task_2](task_2) | Separation of Concerns — `notificationsList` dans `App`, nouveau `NotificationItem` |
| [task_3](task_3) | Devtool React extension — captures Components et Profiler |
| [task_4](task_4) | CourseList & CourseListRow — bascule `isLoggedIn` entre `Login` et `CourseList` |
| [task_5](task_5) | Enhance Notifications component — tiroir `displayDrawer` et état vide |

## Prérequis

- Node 20.x, npm 10.x
- Jest 29.7.0

## Usage

```bash
cd task_0/dashboard
npm install
npm run dev     # serveur de développement Vite
npm test        # Jest
npm run lint    # ESLint
```