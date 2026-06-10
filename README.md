# Paperless-ngx Skill

A Hermes skill for working with a Paperless-ngx instance: search documents, inspect metadata, upload files, download archives, manage tags/types/correspondents, and add or read document notes.

## What’s included

- `scripts/search.mjs` — full-text search with filters
- `scripts/list.mjs` — recent documents
- `scripts/get.mjs` — document details and OCR text
- `scripts/upload.mjs` — upload documents with metadata
- `scripts/download.mjs` — download archived or original files
- `scripts/tags.mjs` — list/create tags
- `scripts/types.mjs` — list document types
- `scripts/correspondents.mjs` — list/create correspondents
- `scripts/notes.mjs` — list/add document notes

## Requirements

- Node.js 18+
- `PAPERLESS_URL` and `PAPERLESS_TOKEN` in the active Hermes environment

Example:

```bash
PAPERLESS_URL=http://paperless-host:8000
PAPERLESS_TOKEN=your-api-token
```

## Quick examples

```bash
# Search
node scripts/search.mjs "electricity bill"

# Inspect a document
node scripts/get.mjs 463 --content

# Download a PDF
node scripts/download.mjs 463 --output ./document.pdf

# Add a note
node scripts/notes.mjs 463 --add "Processed: reimbursement approved."
```

## Notes

- Missing tags, types, and correspondents can be created automatically by the upload helper.
- Document notes are exposed through the Paperless API at `/api/documents/{id}/notes/`.
- This repository is intended to stay small and practical; no extra wrapper layer unless it is needed.

## Layout

```text
.
├── README.md
├── SKILL.md
├── _meta.json
├── skill-card.md
├── references/
└── scripts/
```

## Related docs

- `SKILL.md` — primary skill instructions
- `references/api.md` — API reference
- `references/hermes-access.md` — Hermes-specific access notes
- `references/usage-notes.md` — observed behavior and caveats
