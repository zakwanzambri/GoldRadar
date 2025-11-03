# Release Guide

Version: 0.1.0

This document outlines how to tag and publish a release, and options to deploy the static SPA.

## 1) Tag the Release

If the repository isn’t initialized yet:

```powershell
# Initialize repo
git init
# Add all files
git add -A
# Commit with release message
git commit -m "chore: release 0.1.0"
# Set default branch (if needed)
git branch -M main
# Add remote (replace with your repo URL)
git remote add origin https://github.com/<your-username>/gold-breakout-scanner.git
# Push
git push -u origin main
```

Create a version tag and push it:

```powershell
# Create tag
git tag v0.1.0
# Push tag
git push origin v0.1.0
```

Optional: Create a GitHub Release and paste notes from `CHANGELOG.md` for `0.1.0`.

## 2) Deploy Options (Static Hosting)

This project is a static SPA (no build required). The entry file is `index.html` and the router uses hash routes (`#/dashboard`, etc.).

### Netlify
- New site → Import from Git.
- Build command: none.
- Publish directory: `.` (project root).
- Environment: none required.

Optional `netlify.toml` (not required):
```toml
[build]
  publish = "."
```

### Vercel
- Import project from Git.
- Framework: “Other”.
- Build command: none.
- Output directory: `.` (root). Vercel will serve static files.

### Cloudflare Pages
- Create project → Connect to Git repo.
- Build command: none.
- Build output directory: `.`.

## 3) Local Demo

Use the Python SPA server:

```powershell
python server.py
# Opens at http://localhost:8000/
```

Or Node dev server:

```powershell
npm run dev
# Opens at http://localhost:3000/
```

## 4) What’s in 0.1.0
- Navigation visibility in light theme (high-contrast text for items/actions/status).
- Scanner status header moved and centered above metrics.
- Mobile polish: larger touch targets (≥44px) and high-contrast text in the drawer.
- Documentation updates: Quick Start, routes, theme notes, changelog.

## 5) Next Release Ideas
- Add backend/data APIs and a production build step.
- Introduce tests and CI (GitHub Actions).
- Observability (error tracking, analytics) and deployment automation.