# Event publisher

**Goal:** publish a meetup on the site from its Luma page or the organizers' notes.

## Inputs
You need the title, start and end time (Logroño local time), venue, Luma URL, a one-paragraph summary in English and Spanish, and speakers (optional). If anything is missing, ask the organizers. Never guess dates, venues or speakers.

## Steps
1. Create `src/content/events/<yyyy-mm-dd>-<slug>.md`:
   ```md
   ---
   title: Building agents with MCP
   date: 2026-11-20T18:30:00+01:00
   endDate: 2026-11-20T21:00:00+01:00
   venue: Venue name, Logroño
   lumaUrl: https://luma.com/<event-id>
   summary:
     en: "One or two friendly sentences in English: what people will see and learn."
     es: "Uno o dos mensajes amables en español: qué verán y aprenderán las personas."
   speakers: ["Name Surname"]
   ---
   ```
   - The offset is `+01:00` from late October to late March and `+02:00` otherwise.
   - For an event that's announced but has no date yet, use `tba: true` and leave out `date`.
2. When the real event replaces a placeholder (for example `kickoff.md` with `tba: true`), update that file instead of adding a duplicate.
3. Run `pnpm test && pnpm build && pnpm test:e2e`.
4. Check the card in `pnpm dev`. It should show the date in Madrid time, the venue and the RSVP button.

## Done when
- The event appears under "Upcoming meetups" with the correct local time.
- The RSVP button opens the event's own Luma page.
- All tests pass.
