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
