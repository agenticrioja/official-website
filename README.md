# Agentic Rioja · AAIF Logroño Chapter

Official site of the AAIF Logroño chapter, live at https://agenticrioja.com. Built with Astro + Tailwind CSS v4 and deployed to GitHub Pages.

## Develop
Requires Node 24 (see `.nvmrc`) and pnpm (pinned via `packageManager`; run `corepack enable`).
```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # type-check + static build into dist/
```

## Test
```sh
pnpm test                               # unit tests (Vitest): event scheduling, dates, structured data
pnpm build && pnpm test:e2e             # end-to-end + accessibility (Playwright + axe) on desktop and mobile
pnpm exec playwright install chromium   # first time only
```

## CI/CD
- `.github/workflows/ci.yml` runs on every pull request and branch push. It covers unit tests, type-check and build, end-to-end and accessibility tests, and a Docker image smoke test. When the end-to-end tests fail, the Playwright report is uploaded as an artifact.
- `.github/workflows/deploy.yml` runs on every push to `main`, every day, and on demand. It runs CI first and deploys to GitHub Pages only if CI passes.

## Preview with Docker
Builds the site and serves it with nginx, the same way GitHub Pages does:
```sh
docker build -t agenticrioja .
docker run --rm -p 8080:80 agenticrioja   # http://localhost:8080
```

## Add an event
Create `src/content/events/<slug>.md`:
```md
---
title: Building agents with MCP
date: 2026-11-20T18:30:00+01:00
endDate: 2026-11-20T21:00:00+01:00
venue: Logroño, La Rioja
lumaUrl: https://luma.com/<event-id>
summary: "One-line description."
speakers: ["Name Surname"]
---
```
- Always include the timezone offset (`+01:00` in winter, `+02:00` in summer). Without it the time is read as UTC.
- Quote `summary` if it contains a colon.
- Use `tba: true` and leave out `date` for an announced event that has no date yet.
- Finished events move to "Past events" on their own, because the site is rebuilt every day.

## Organizers
Each organizer is a file in `src/content/organizers/`. A `photo` in `src/assets/people/` replaces the AAIF badge.

## Deploy
Push to `main`. The workflow in `.github/workflows/deploy.yml` publishes the site to GitHub Pages.

One-time setup: in the repo, go to Settings → Pages. Set Source to GitHub Actions, set the custom domain to `agenticrioja.com` and turn on Enforce HTTPS.

DNS:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | www | agenticrioja.github.io |
