# dashboard

The Holberton *School dashboard*, built with React and Vite.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest test suite |

## Testing setup

Jest is configured in [package.json](package.json):

- `.babelrc` transpiles JSX and modern syntax through `@babel/preset-env` and `@babel/preset-react`
- `fileTransformer.js` replaces image imports with their file name
- `identity-obj-proxy` stands in for CSS modules
- `setupTests.js` adds the `@testing-library/jest-dom` matchers
