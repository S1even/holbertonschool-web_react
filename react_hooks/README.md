# React hooks

Suite du projet `react_state`. Le dashboard passe aux composants fonctionnels et aux hooks, à la
place des classes ES6 et des méthodes de cycle de vie.

| Tâche | Sujet |
| --- | --- |
| [task_0](task_0) | Convert Header Component — Header devient une fonction qui lit le contexte par `useContext` |
| [task_0](task_0) | Update Footer Component — Footer lit le contexte par `useContext` au lieu du `Consumer` |
| [task_1](task_1) | Convert Login component — Login devient une fonction, son état passe par `useState` |
| [task_2](task_2) | Update the NotificationItem component — `memo` remplace `PureComponent` |
| [task_3](task_3) | Update the Notifications component — `memo` avec comparaison sur le tiroir et la longueur de la liste |
| [task_4](task_4) | Modernizing the Parent — App devient une fonction, état en `useState`, callbacks en `useCallback` |
| [task_4](task_4) / [task_5](task_5) | Side Effect — notifications et cours chargés avec axios dans des `useEffect` |
| [task_5](task_5) | Custom React hook — l'état et la logique du formulaire passent dans `useLogin` |
| [task_6](task_6) | State Symphony — `useReducer` remplace le Context API, l'état passe par les props |

## Prérequis

- Node 20.x, npm 10.x
- Jest 29.7.0

## Usage

```bash
cd task_0/dashboard
npm install
npm run dev     # serveur de développement Vite
npm run build   # build de production
npm test        # Jest
npm run lint    # ESLint
```
