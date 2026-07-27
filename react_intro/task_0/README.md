# Task 0. Basic application

A basic React application named `dashboard`, created with Vite.

The app renders three sections:

- `App-header` — the Holberton logo and the `School dashboard` title
- `App-body` — `Login to access the full dashboard`
- `App-footer` — `Copyright {current year} - holberton School`

Jest is configured at the end of [dashboard/package.json](dashboard/package.json), with
[dashboard/.babelrc](dashboard/.babelrc) transpiling JSX,
[dashboard/fileTransformer.js](dashboard/fileTransformer.js) stubbing image imports and
[dashboard/setupTests.js](dashboard/setupTests.js) loading `@testing-library/jest-dom`.

[dashboard/src/App.spec.js](dashboard/src/App.spec.js) covers the rendered heading, the two
paragraphs and the logo, querying by role, text and `alt` attribute so the assertions stay
independent of the markup structure.

## Usage

```bash
cd dashboard
npm install
npm run dev     # start the dev server
npm run lint    # ESLint
npm test        # Jest
```
