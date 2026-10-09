---
name: Agentic Rioja
description: A warm, local visual system for the Logroño AI agents community.
colors:
  ink: "#1f1a17"
  cream: "#f7f1e8"
  sand: "#fbe7cf"
  wine: "#8c1c3f"
  wine-deep: "#3d0f22"
  vine: "#3f6b35"
  terra: "#b5522b"
  ochre: "#e3a33b"
  river: "#5f97bf"
  agent: "#4d7cfe"
typography:
  display:
    fontFamily: "Fraunces Variable, Georgia, serif"
    fontWeight: 700
    lineHeight: 1.05
  headline:
    fontFamily: "Fraunces Variable, Georgia, serif"
    fontWeight: 700
  title:
    fontFamily: "Instrument Sans Variable, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
  body:
    fontFamily: "Instrument Sans Variable, system-ui, sans-serif"
    fontSize: "1rem"
  label:
    fontFamily: "Instrument Sans Variable, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
rounded:
  card: "24px"
  illustration: "32px"
  control: "9999px"
spacing:
  content-gutter: "16px"
  card: "24px"
  section-mobile: "64px"
  section-desktop: "96px"
components:
  button-primary:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.cream}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.wine-deep}"
    textColor: "{colors.cream}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  card-light:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
---

# Design System: Agentic Rioja

## Overview

**Creative North Star: "Rioja Workshop"**

The site feels like an open local workshop: warm, practical, and collaborative. Cream and sand provide a calm base, wine and vine give it a distinct regional identity, and a friendly illustration and agent artwork bring the subject to life. The visual language welcomes newcomers while leaving room for real technical content.

Sections are spacious and easy to scan. Rounded controls and cards feel warm and approachable; shadows add only subtle ambient depth. The visual system should remain coherent across the single-page site and its 404 page.

**Key Characteristics:**
- Local warmth through the Rioja palette and Logroño illustration.
- Clear editorial headings paired with straightforward body type.
- Generous spacing, softly rounded forms, and restrained depth.

## Colors

The palette comes from La Rioja. The frontmatter values are the normative tokens from `src/styles/global.css`.

### Primary
- **Wine:** Main calls to action, links, and emphasis.
- **Deep wine:** Dark event and footer sections, and primary-button hover.

### Secondary
- **Vine:** The invitation section and small supporting labels.
- **Ochre:** Focus outlines and small highlights.

### Tertiary
- **Terra, river, and agent:** Decorative accents in artwork and topic markers. Agent blue and terra are not body-text colors on light surfaces.

### Neutral
- **Ink:** Main text and strong contrast.
- **Cream:** Main page background and light text on deep wine.
- **Sand:** Warm section tint.
- **White:** Raised card surfaces.

**The Text-Safe Pair Rule.** Keep body text on established high-contrast pairs; test every new pair against WCAG 2.1 AA.

## Typography

**Display Font:** Fraunces Variable, with Georgia and serif fallbacks.  
**Body Font:** Instrument Sans Variable, with system sans-serif fallbacks.

**Character:** Fraunces gives headings a human editorial voice; Instrument Sans keeps event information and navigation direct and readable.

### Hierarchy
- **Display:** Bold Fraunces, responsive from 2.25rem to 3.75rem, tight line height. Reserved for the hero.
- **Headline:** Bold Fraunces, responsive from 1.875rem to 2.25rem, for section headings.
- **Title:** Semibold Instrument Sans at 1.25rem for cards and smaller headings.
- **Body:** Instrument Sans at 1rem, with 1.125rem for introductory passages.
- **Label:** Semibold Instrument Sans at 0.875rem or smaller for navigation, dates, and small identifiers.

**The Two-Voice Rule.** Use Fraunces for expressive headings and Instrument Sans for practical reading and controls.

## Layout

Content sits in a centered container with a maximum width of 72rem and a minimum side gutter of 1rem. Sections use 4rem vertical padding on small screens and 6rem from the medium breakpoint. The hero and informational sections become two-column compositions on wider screens; topic cards progress from one to two to four columns, while other card groups use two or three columns as content allows. Mobile keeps a single reading column and a compact menu.

## Elevation & Depth

Flat color blocks, borders, and subtle tints provide most separation. A few soft shadows create ambient depth around the hero illustration and floating mobile navigation; cards generally sit on tonal contrast or a faint ring.

**The Ambient Depth Rule.** Shadows support a real layer or visual focal point, without making every card appear lifted.

## Shapes

The site uses friendly rounded silhouettes. Cards commonly use the card radius; the hero illustration has a slightly larger corner. Primary controls are pill shaped. Fine borders and rings define light cards, while dashed borders distinguish the meetup-step cards.

## Components

### Buttons
- **Shape:** Pill shaped with generous horizontal padding.
- **Primary:** Wine background and light text; deep wine on hover.
- **Secondary:** Transparent with an ink border on light surfaces.
- **Focus:** Visible ochre outline, offset from the control.

### Cards / Containers
- **Corner Style:** Soft card radius.
- **Background:** White or a light tint over the section color.
- **Depth:** Faint ring or tonal contrast at rest; no routine card shadow.
- **Internal Padding:** Usually 1.5rem, with larger panels using 2rem.

### Navigation
- **Desktop:** Compact text links with wine hover color and a pill call to action.
- **Mobile:** A native details disclosure opens a floating white menu; links retain comfortable touch spacing.

### Agent Artwork
- Topic artwork uses the AAIF agent GIFs through `AgentGif.astro`, which serves still frames for reduced-motion users.

## Do's and Don'ts

### Do:
- **Do** keep the Rioja palette, two-font pairing, and rounded form language coherent across sections.
- **Do** retain visible AAIF, Linux Foundation, and Cloud Native Rioja identities.
- **Do** keep focus and text contrast clear on both light and dark sections.

### Don't:
- **Don't** use agent blue or terra for body text on light backgrounds.
- **Don't** add heavy shadows to every card.
- **Don't** turn community content into corporate-style claims or invented proof.
