# Cursor Onboarding Memory Cards

Simple flashcard app to internalize Cursor Onboarding material.  
PRD: [`prd.md`](./prd.md) · Canonical source on Notion: <https://www.notion.so/35dda74ef04580ef94f7d7d2341fee30>

- **Scope:** Client-only MVP, no external APIs, static data in `data/`.
- **Goal:** Public repo + optional static hosting.

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

## Next steps

Pick a stack (plain HTML, Vite + React, etc.), wire the UI to `data/cursor-onboarding-deck.json`, then deploy to any static host.
