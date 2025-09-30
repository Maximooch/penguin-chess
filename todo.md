# Penguin Chess — TODO and Roadmap

Status (2025-09-30)
- Branch: feat/coords-server-scripts
- Done in this branch:
  - Restored css/style.css from origin/main
  - Appended board coordinates overlay (A-H, 1-8) via CSS
  - Hardened run scripts (bash and batch)
  - Added .gitignore

Guiding principles
- Keep the game simple and fast; prioritize UX clarity and correctness.
- Prefer Python-driven edits for multi-file/complex changes; avoid fragile diff tooling.
- Add automation only when it reduces maintenance cost.

Version 1.x — polish and essentials (ship quickly)

1.0 (Baseline polish) — Current target
- [x] Board coordinates overlay (CSS)
- [ ] Server: configurable PORT via env; OPEN_BROWSER toggle
  - Acceptance: PORT=8080 python server.py serves on 8080; OPEN_BROWSER=0 prevents auto-open
- [ ] README: fix incomplete sentence; add notes about coordinates and server options
- [ ] QA checklist (qa.md): desktop and mobile sanity (moves, undo, capture display)
- [ ] Lint/format pass (prettier/eslint minimal config)
- [ ] Accessibility basics: focus outlines, button aria-labels, contrast check

1.1 (UX improvements)
- [ ] Last-move highlight (source and destination squares)
- [ ] Toggle to show/hide legal move highlights
- [ ] Mobile: larger tap targets, ensure labels don’t overlap on small screens
- [ ] Subtle animations (CSS transitions) for move/capture/selection
- [ ] Optional keyboard navigation (arrows/WASD to move selection, Enter to pick)

1.2 (State + persistence)
- [ ] Local save/load in localStorage (auto-save move history)
- [ ] FEN export/import
- [ ] Move list (basic PGN-like text), clickable to navigate history
- [ ] New Game dialog (confirm + pick side)

1.3 (Testing + CI)
- [ ] Unit tests for move legality and core rules; small perft sanity set
- [ ] GitHub Actions: lint + unit tests on PRs
- [ ] Browser smoke test (Playwright) for a minimal scenario

Version 2.x — features and structure

2.0 (Architecture + docs)
- [ ] Clear separation of logic vs UI; optional JSDoc or TypeScript types
- [ ] Developer docs: contribution guide, architecture overview, ADRs (coords CSS, server strategy)
- [ ] Performance probe: batch DOM updates (requestAnimationFrame), reduce layout thrash

2.1 (Interaction & visuals)
- [ ] Drag-and-drop with pointer events
- [ ] Move/capture animations
- [ ] Theme toggle (classic/high-contrast/dark mode)

2.2 (Optional engine)
- [ ] Basic AI (minimax + material eval), fixed depth, simple time control
- [ ] AI vs Human mode selection

Version 3.x — networked play (optional)

3.0 (Online)
- [ ] WebSocket server (FastAPI/Starlette) with simple lobby
- [ ] Sync moves; offer rematch
- [ ] Server-side move validation (minimal anti-cheat)

3.1 (Hosting & packaging)
- [ ] GitHub Pages for static client; keep Python server for local dev only
- [ ] Makefile/Taskfile for common tasks

Backlog (unsorted)
- [ ] PGN export
- [ ] Chess clock (timers)
- [ ] FEN editor/custom setup
- [ ] Internationalization scaffolding

Execution plan (near-term)
- Implement v1.0 server.py changes (PORT, OPEN_BROWSER) via Python edit
- Update README (fix sentence; document coordinates + server options)
- Add qa.md with manual test checklist
- Commit to feat/coords-server-scripts; open PR

Tooling note (lessons learned)
- Use Python for read/modify/write with backups; verify before commit
- Avoid multi-file diffs for large or colon-heavy content; brittle
- Keep commits small and reversible; include clear acceptance criteria in messages
