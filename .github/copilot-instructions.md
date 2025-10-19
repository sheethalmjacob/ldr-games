## Quick context

This is a tiny static web project that serves a single page with two main features: a Canvas-based Brick Breaker game and a simple Notes panel. No build system, no bundler, and no external dependencies — just plain HTML, CSS and JavaScript.

Key files:
- `index.html` — page layout and script ordering (loads `game.js` then `notes.js`).
- `game.js` — entire game logic: canvas setup, `ball`, `paddle`, bricks array, `draw()` loop (uses requestAnimationFrame), collision detection, and game state flags like `gameStarted` and `score`.
- `notes.js` — notes UI, stores notes in Local Storage under key `gameNotes`, exposes functions `addNote()`, `saveNotes()` and `createNoteElement()`.
- `styles.css` — visual layout: two-column flex container, canvas in left column, notes on the right.

## Big-picture architecture and data flow

- Single-page static app. The two subsystems are intentionally decoupled and communicate only via the DOM and browser storage.
  - Game: reads/writes only in-memory variables and the canvas. It triggers `alert()` and calls `document.location.reload()` on win/lose.
  - Notes: reads/writes `localStorage['gameNotes']` and manipulates the DOM under the element with id `notesContainer`.
- Script ordering matters: `index.html` includes `game.js` first and `notes.js` second. When moving code to modules or changing load order, update `index.html` accordingly.

## Project-specific conventions and patterns for edits

- Minimal, non-modular code: files rely on global variables (e.g., `ball`, `paddle`, `notes`). Avoid refactoring to modules without updating `index.html` and testing load order.
- DOM lookups use `getElementById` (ids: `gameCanvas`, `noteText`, `addNote`, `notesContainer`). Use those ids to wire UI changes.
- Notes persistence: `notes` is an array loaded with `JSON.parse(localStorage.getItem('gameNotes')) || []`. Keep that exact key when reading/writing.
- Keyboard handling:
  - Game: listens for `keydown`/`keyup` to set `rightPressed` / `leftPressed`.
  - Notes: `Enter` (without Shift) submits a note; Shift+Enter produces newline. Preserve this behavior when modifying `notes.js`.
- Animations: the game uses `requestAnimationFrame(draw)`. When debugging or modifying the loop, pause/resume via devtools or comment the RAF call; do not replace with setInterval without reason.

## Integration points and external surface

- Browser APIs used: Canvas 2D API, `requestAnimationFrame`, `localStorage`, `alert()`, `document.location.reload()`.
- No network calls, no backend. Any change that introduces fetching or external dependencies should include instructions for a local server and updated docs.

## Developer workflows (how to run, test, debug)

- Run locally (serve static files):

  - Python built-in server:

    python -m http.server 8000

  - Or (if Node available) quick static server:

    npx http-server . -p 8000

  Open http://localhost:8000 in a browser. Opening `index.html` via `file://` may work but some devtools behaviors are better over http.

- Manual test checklist after code changes:
  - Open browser devtools Console for errors.
  - Verify canvas renders and `Click to Start` appears (game not started). Interact with arrow keys and click to begin. Observe `score` increment and brick collisions.
  - Add notes, reload page, ensure notes persist (check Application > Local Storage > `gameNotes`).
  - Check that `Enter` submits and `Shift+Enter` inserts newline in the notes textarea.

## Examples to reference in edits

- To find where notes are persisted: `notes.js` — search for `localStorage.getItem('gameNotes')` and `localStorage.setItem('gameNotes', JSON.stringify(notes))`.
- To find the game loop and state flags: `game.js` — `function draw()`, and variables `gameStarted`, `ball`, `paddle`, `bricks`, `score`.

## Non-goals / things not present

- There is no test harness, bundler, package.json, or CI. Add them only if you include setup instructions and a README update.
- No cross-file imports; converting to ES modules is allowed but must preserve script load order and be tested in-browser.

## Editing guidance for AI agents

- Keep changes minimal and local: this is a small repo; prefer minimal diffs that change one file at a time and include a short manual test plan as PR description.
- If introducing new global state or storage keys, choose distinct names and update README.md and this instruction file.
- Prefer explicit DOM ids and avoid implicit traversal. When adding features, document the new ids/keys in this file.

If anything in these notes is unclear or you'd like more detail (e.g., suggested refactor to modules, adding unit tests, or adding a build step), tell me which part to expand.
