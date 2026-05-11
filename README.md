# Cursor Onboarding Memory Cards

Tiny flashcard app for internalizing Cursor Onboarding material.  
PRD: [`prd.md`](./prd.md) · Canonical source on Notion: <https://www.notion.so/35dda74ef04580ef94f7d7d2341fee30>

- **Scope:** Client-only, no build step, no external APIs.
- **Data:** Local JSON in `data/`.
- **Hosting:** Any static host (works on GitHub Pages out of the box).

## Run it

### Option A — GitHub Pages (recommended)

Once Pages is enabled for this repo, open:

```
https://matsmillnert-svg.github.io/cursor-onboarding-memory-cards/
```

### Option B — Local server

`fetch` is blocked from `file://` in most browsers, so serve the folder:

```bash
cd cursor-onboarding-memory-cards
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server works (e.g. `npx serve`, `caddy file-server`, etc.).

## How to use

- **Click the card** or press **Space / Enter** to flip.
- **← / →** (or **K / J**) to move through the deck.
- **S** to shuffle.
- **T** to toggle light/dark theme.
- Filter by **tag** with the dropdown to focus on, say, `architecture` or `competitors`.

## Decks

- [`data/cursor-onboarding-deck.json`](./data/cursor-onboarding-deck.json) — real cards distilled from the Cursor Learning doc (eras, four pillars, indexing architecture, products, competitive positioning, enterprise/security).
- [`data/stub-deck.json`](./data/stub-deck.json) — original placeholder deck (kept for tests/fallback).

Cards follow this shape:

```json
{
  "id": "unique-id",
  "front": "Question or prompt",
  "back": "Answer or explanation",
  "tags": ["topic", "topic"]
}
```

## Project layout

```
.
├── index.html      # single page
├── styles.css      # theme + layout
├── app.js          # state, navigation, keyboard, theme
├── data/
│   ├── cursor-onboarding-deck.json  # real deck
│   └── stub-deck.json               # fallback
├── prd.md          # product requirements (mirrors the Notion PRD)
└── README.md
```
