# Field Notes

A simple blog application built with Vue, Vite, and Vue Router.

## Features

- Home page that fetches blog posts from `https://api.oluwasetemi.dev/posts`
- Detail page for each post using route params
- Lazy loaded route views
- `Suspense` fallback while route components and async data resolve
- Error boundary for async route failures
- Catch-all 404 route for invalid URLs
- Home and previous-page navigation from anywhere in the app

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## CI on GitHub Actions

This repository includes a small GitHub Actions workflow at `.github/workflows/ci.yml`.

It runs `npm ci` and `npm run build` so every push to `main` and every pull request gets a build check in GitHub.

## Deploy with Netlify

The usual Netlify setup for a Vue/Vite app is to connect the GitHub repository in the Netlify dashboard and let Netlify build and deploy on every push.

### Netlify settings

Use these values:

- Build command: `npm run build`
- Publish directory: `dist`

`netlify.toml` is already included, and it rewrites all routes to `index.html` so Vue Router links like `/posts/:postId/:slug` still work on refresh.

## Deploy with Vercel

The usual Vercel setup is the same idea: import the GitHub repository into Vercel and let Vercel create deployments automatically from Git pushes.

### Vercel settings

Vercel usually detects Vite automatically. If you need to confirm the values:

- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` is already included, and it rewrites unmatched routes to `index.html` so direct visits to nested client-side routes still load the app.
