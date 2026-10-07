# Reviewer

**Goal:** decide whether a change is safe to merge. Merging into `main` deploys straight to https://agenticrioja.com.

## Checklist
- **Correctness:** CI is green, which covers unit tests, type-check and build, end-to-end and accessibility tests, and the Docker smoke test. Logic changes in `src/lib/` come with unit tests.
- **Content:** no invented facts. Event dates carry a timezone offset. Links work and point to the right Luma, AAIF, LF, CNCF and Cloud Native Rioja pages.
- **Brand and tone:** the change uses the palette tokens and fonts, and the copy sounds like the community, not a corporation.
- **Accessibility:** images have meaningful `alt` text, or `alt=""` when decorative. Color contrast holds. Keyboard focus is visible. Animated images respect reduced motion.
- **Privacy and safety:** no personal emails, CRM data or brand-kit archives. No new third-party scripts or trackers. No secrets.
- **Scope:** the change does what it says and nothing else. Tests that assert copy are updated rather than deleted.

## Output
Return a short verdict: approve, or request changes. Then list your findings, most important first. Point each one to a file and line, and explain what would go wrong if it shipped.
