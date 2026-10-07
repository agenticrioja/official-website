# AGENTS.md

Instructions for AI coding agents (any tool) and humans working on this repository.
Task-specific briefs live in [`agents/`](agents/).

## Project
**Agentic Rioja** (https://agenticrioja.com) is the website of the AI agents community in Logroño, La Rioja. It is the official Logroño chapter of the Agentic AI Foundation (AAIF), a Linux Foundation project. Its sibling community is Cloud Native Rioja (CNCF).

It is a static, single-page site in English, deployed to GitHub Pages.

## Stack
- Astro 7, static output, with TypeScript strict
- Tailwind CSS v4, configured with `@theme` tokens in `src/styles/global.css`
- Content Collections with Zod schemas in `src/content.config.ts`
- Vitest for unit tests, Playwright + axe-core for end-to-end and accessibility tests
- Node 24 (`.nvmrc`), with pnpm pinned through `packageManager` (`corepack enable`)

## Commands
```sh
pnpm install
pnpm dev                 # http://localhost:4321
pnpm test                # unit tests
pnpm build               # astro check + build into dist/
pnpm test:e2e            # needs a build first; first time: pnpm exec playwright install chromium
docker build -t agenticrioja . && docker run --rm -p 8080:80 agenticrioja
```
Before you push, `pnpm test`, `pnpm build` and `pnpm test:e2e` must all pass. CI runs the same checks and blocks the deploy if any of them fail.

## Layout
```
src/pages/index.astro        page composition (section order)
src/components/              one component per section; LogronoScene.astro = hero SVG
src/content/events/*.md      meetups (one file each)
src/content/organizers/*.md  organizers
src/lib/events.ts            pure event logic (upcoming/past, JSON-LD, dates); unit-tested
src/site.ts                  external URLs and nav
src/assets/                  brand (AAIF kit), community logos, people photos
tests/unit, tests/e2e        Vitest / Playwright specs
.github/workflows/           ci.yml (tests) is reused by deploy.yml (Pages)
```

## Conventions
- **Tone:** friendly and local, but still professional. It's a community, not a corporation. Small Spanish touches are fine ("¡Nos vemos en Logroño!"); the main copy stays in English.
- **Brand:** use the La Rioja palette tokens: `wine`, `wine-deep`, `vine`, `cream`, `sand`, `ochre`, `terra`. Headings use `font-display` (Fraunces). `agent` blue and `terra` are decorative only, never body text on light backgrounds.
- **Accessibility:** WCAG 2.1 AA is enforced by `tests/e2e/a11y.spec.ts`. Check contrast before introducing a new color pair. GIFs go through `AgentGif.astro` so they show a still frame when reduced motion is on.
- **Affiliation must stay visible:** the AAIF logo and links, the Linux Foundation mention and Code of Conduct, and the Cloud Native Rioja link. Tests check all of these.
- **Events:** dates need a timezone offset (`+01:00` in winter, `+02:00` in summer). Quote `summary` if it contains a colon. Past/upcoming is worked out at build time, and the site rebuilds daily.
- **Code style:** match the surrounding code. Keep components small, Tailwind classes inline, and no client-side JS framework. Put logic in `src/lib/` with unit tests.
- **Tests track behavior, not copy:** when you change visible text, update the specs that assert on it.

## Rules
- Don't commit the AAIF brand-kit zip, CRM spreadsheets or other personal data. Don't publish personal email addresses.
- Don't add analytics, trackers or third-party scripts without the organizers' approval.
- Don't invent facts about people or events. Organizer bios and event details come from the organizers.
- Keep this file and `agents/` tool-agnostic. Don't add files or wording specific to one AI vendor.
