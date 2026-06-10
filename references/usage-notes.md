# Paperless-ngx Usage Notes

This file captures practical behavior observed while working with the skill.

## Upload behavior

- `scripts/upload.mjs` will create missing tags automatically when `--tags` includes a name that does not yet exist.
- `scripts/upload.mjs` will also create missing document types and correspondents automatically when `--type` or `--correspondent` are supplied with a name that does not yet exist.
- Because of that behavior, typos in metadata values become new archive metadata entries.

## Lookup behavior

- The current convenience scripts load tags, document types, and correspondents from the first page of each API list endpoint.
- This is fine for small to medium archives, but large installations may need pagination added if metadata IDs are not resolving as expected.

## Document notes

- `scripts/notes.mjs` lists notes with `node scripts/notes.mjs <id>`.
- `scripts/notes.mjs --add "..."` adds a new note.
- Paperless documents also expose notes through `/api/documents/{id}/notes/`.
- `GET` returns the notes attached to a document.
- `POST` with `{"note": "..."}` adds a new note.
- Notes are useful for processing annotations, short summaries, and workflow status that should remain attached to the document.

## Hermes-specific access

- In Hermes sessions, Paperless credentials belong in the active Hermes profile `.env` file, usually `~/.hermes/.env` or `~/.hermes/profiles/<name>/.env`.
- Do not rely on clawdbot-specific config paths when troubleshooting Hermes access.

## Safe usage tip

- For high-confidence tests, prefer a read-only probe first (for example, document search or listing) before trying upload or metadata-changing actions.