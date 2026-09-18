# Task 0. Set TailwindCSS

This task copies the React component dashboard and integrates TailwindCSS v4 through the Vite plugin without creating a Tailwind configuration file.

## Dashboard changes

- Adds `@tailwindcss/vite` and `tailwindcss` v4 to the Vite app.
- Adds `@fontsource/roboto` and imports Roboto weights `400`, `500`, and `700`.
- Adds `src/main.css` with Tailwind's CSS-first theme configuration and a base layer that applies Roboto across the app.

## Run

```bash
cd dashboard
npm install
npm run dev
npm test
```
