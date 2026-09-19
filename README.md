# Manus AI Ludo (`manusailudo`)

Web Ludo prototypes and assets produced with Manus AI. The repo is mostly a **flat dump** of HTML demos, JavaScript modules, art, audio, and design notes.

## Quick start (browser demos)

No build step. Open any of these in a browser (or serve the folder with `python -m http.server`):

| File | What it is |
|------|------------|
| `workingludogai.html` | Interactive Ludo basics (self-contained) |
| `ultimate_ludo.html` | Ultimate Ludo single-file prototype |
| `ludoboardgoogleai.html` | Board / piece movement experiment |
| `advanced_ludo.html` | Modular “Cosmic Ludo” shell (`style.css` + root `*.js`) |
| `playerselection.html` | Player setup UI sketch |

`index.html` links to these demos.

## Layout (current)

| Area | Notes |
|------|--------|
| `*.html` | Playable / experimental entry points at repo root |
| `*.js`, `style.css` | Modular game scripts used by `advanced_ludo.html` |
| Images / audio / board art | Many files at repo root (`*.png`, `*.webp`, dice art, etc.) |
| `docs/` | Rules and design notes |
| `app-debug.apk` | Android debug APK artifact (large) |
| Design sources | `.blend`, `.ai`, `.xcf`, `.eps`, `.pdf`, etc. |

## Known gaps

- `config.js` expects paths under `assets/images/`, `assets/sounds/`, and `assets/music/`, but most media currently lives at the **repo root** with different filenames. Prefer the self-contained HTML demos until assets are reorganized.
- Multiple overlapping design docs and scratch notes remain from early iteration; see `docs/` for curated copies where moved.

## Development notes

- Static front-end; no `package.json` required for the HTML demos.
- Asset licenses: see `License.txt`, `License free.txt`, `License premium.txt`, and `Fonts.txt` (Kenney / font attributions).
- `.gitignore` ignores OS/editor junk, env files, and Blender autosaves (`*.blend1`).

## License

Mixed / not fully specified. Respect third-party asset licenses in-repo; contact the owner for project licensing.
