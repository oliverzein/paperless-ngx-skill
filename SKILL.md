---
name: paperless-ngx
description: Manage documents in Paperless-ngx - search, upload, tag, and retrieve.
homepage: https://github.com/paperless-ngx/paperless-ngx
metadata: {"clawdbot":{"requires":{"env":["PAPERLESS_URL","PAPERLESS_TOKEN"]},"primaryEnv":"PAPERLESS_TOKEN"}}
---

# Paperless-ngx

Document management via Paperless-ngx REST API.

## Configuration

For Hermes sessions, store Paperless credentials in the active Hermes profile environment file, typically `~/.hermes/.env` or `~/.hermes/profiles/<name>/.env`.

```bash
PAPERLESS_URL=http://your-paperless-host:8000
PAPERLESS_TOKEN=your-api-token
```

See `references/hermes-access.md` for the Hermes-specific access checklist and probe.

Get your API token from Paperless web UI: Settings → Users & Groups → [user] → Generate Token.

## Quick Reference

| Task | Command |
|------|---------|
| Search documents | `node {baseDir}/scripts/search.mjs "query"` |
| List recent | `node {baseDir}/scripts/list.mjs [--limit N]` |
| Get document | `node {baseDir}/scripts/get.mjs <id> [--content]` |
| Upload document | `node {baseDir}/scripts/upload.mjs <file> [--title "..."] [--tags "a,b"]` |
| Download PDF | `node {baseDir}/scripts/download.mjs <id> [--output path]` |
| Add/list document notes | `node {baseDir}/scripts/notes.mjs <id> [--add "..."]` |
| List tags | `node {baseDir}/scripts/tags.mjs` |
| List types | `node {baseDir}/scripts/types.mjs` |
| List correspondents | `node {baseDir}/scripts/correspondents.mjs` |

All scripts are in `{baseDir}/scripts/`.

## Common Workflows

### Find a document

```bash
# Full-text search
node {baseDir}/scripts/search.mjs "electricity bill december"

# Filter by tag
node {baseDir}/scripts/search.mjs --tag "tax-deductible"

# Filter by document type
node {baseDir}/scripts/search.mjs --type "Invoice"

# Filter by correspondent
node {baseDir}/scripts/search.mjs --correspondent "AGL"

# Combine filters
node {baseDir}/scripts/search.mjs "2025" --tag "unpaid" --type "Invoice"
```

### Get document details

```bash
# Metadata only
node {baseDir}/scripts/get.mjs 28

# Include OCR text content
node {baseDir}/scripts/get.mjs 28 --content

# Full content (no truncation)
node {baseDir}/scripts/get.mjs 28 --content --full
```

### Upload a document

```bash
# Basic upload (title auto-detected)
node {baseDir}/scripts/upload.mjs /path/to/invoice.pdf

# With metadata
node {baseDir}/scripts/upload.mjs /path/to/invoice.pdf \
  --title "AGL Electricity Jan 2026" \
  --tags "unpaid,utility" \
  --type "Invoice" \
  --correspondent "AGL" \
  --created "2026-01-15"
```

Notes:
- `--tags` creates missing tags automatically.
- `--type` and `--correspondent` also create missing values automatically if they do not already exist.
- Review the values carefully before uploading, because typos will create new metadata entries.

### Download a document

```bash
# Download to current directory
node {baseDir}/scripts/download.mjs 28

# Specify output path
node {baseDir}/scripts/download.mjs 28 --output ~/Downloads/document.pdf

# Get original (not archived/OCR'd version)
node {baseDir}/scripts/download.mjs 28 --original
```

### Manage document notes

Paperless documents can also store notes via the document notes helper.
Keep this helper intentionally small: list notes or add one note, nothing more unless the API clearly needs it.

```bash
# List notes for a document
node {baseDir}/scripts/notes.mjs 28

# Add a note
node {baseDir}/scripts/notes.mjs 28 --add "Processed: reimbursement approved."
```

Use notes for processing annotations, short summaries, or workflow status that should stay attached to the document.
Prefer the helper for normal use; fall back to the raw API only if a future Paperless change requires an extra field or special handling.

### Manage metadata

```bash
# List all tags
node {baseDir}/scripts/tags.mjs

# List document types
node {baseDir}/scripts/types.mjs

# List correspondents
node {baseDir}/scripts/correspondents.mjs

# Create new tag
node {baseDir}/scripts/tags.mjs --create "new-tag-name"

# Create new correspondent
node {baseDir}/scripts/correspondents.mjs --create "New Company Name"
```

## Output Format

All scripts output JSON for easy parsing. Use `jq` for formatting:

```bash
node {baseDir}/scripts/search.mjs "invoice" | jq '.results[] | {id, title, created}'
```

## Advanced Usage

For complex queries or bulk operations, see [references/api.md](references/api.md) for direct API access patterns.
See also [references/hermes-access.md](references/hermes-access.md) for the Hermes-specific access checklist and probe.
See also [references/usage-notes.md](references/usage-notes.md) for observed behavior, notes API usage, and lookup caveats.

Note: direct update, delete, or bulk-edit calls can modify archive data significantly. Use them carefully and only when the change is intentional.

## Troubleshooting

**"PAPERLESS_URL not set"** — Check the active Hermes profile `.env` (typically `~/.hermes/.env` or `~/.hermes/profiles/<name>/.env`) or export it in the current shell.

**"401 Unauthorized"** — Check PAPERLESS_TOKEN is valid. Regenerate in Paperless UI if needed.

**"Connection refused"** — Verify Paperless is running and URL is correct (include port).

**Upload fails silently** — Check Paperless logs; file may be duplicate or unsupported format.
