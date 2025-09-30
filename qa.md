# QA Checklist (v1.0)

Scenarios
- Desktop Chrome/Firefox/Safari
- Mobile (responsive devtools @ 375x667)

Checklist
- Load index.html: board renders, coordinates visible (A–H bottom row, 8–1 left column)
- Move a few pieces: legal moves highlight; captures update captured pieces list
- Undo button restores previous state
- New Game resets board and status
- Keyboard tabbing: focus outline visible on buttons
- Mobile layout: board and controls remain usable; labels do not overlap

Server
- Default port: `python server.py` serves on 8000 and opens browser
- Custom port: `PORT=8081 python server.py` serves on 8081
- OPEN_BROWSER=0 prevents auto-opening browser
