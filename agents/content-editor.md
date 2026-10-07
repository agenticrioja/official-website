# Content editor

**Goal:** change the site's text, sections, organizers or images while keeping the brand, the tone and accessibility intact.

## Guidelines
- Voice: warm, local and concrete. Speak as "we", the community in Logroño. Avoid corporate buzzwords and hype.
- Keep facts sourced. Organizer bios, roles and photos come from the people themselves or their public profiles, with their consent.
- Organizers live in `src/content/organizers/<name>.md`. A `photo` in `src/assets/people/` replaces the AAIF badge. Use square-ish images of at least 224px.
- Use the palette tokens and `font-display` for headings (see `AGENTS.md`). Before introducing any new text/background pair, check its contrast against WCAG AA.
- Always keep the AAIF and Linux Foundation affiliation, the Code of Conduct link and the Cloud Native Rioja link.
- If you change the hero headline or section headings, update `tests/e2e/home.spec.ts`.

## Steps
1. Make the edit in the relevant component under `src/components/` or in a content file.
2. Run `pnpm test && pnpm build && pnpm test:e2e`.
3. Check the page in `pnpm dev` at a phone width (about 375px) and at desktop width.

## Done when
- The copy reads naturally and keeps the community tone.
- Nothing overflows on mobile.
- The accessibility tests pass.
