# Hermes + Paperless-ngx access notes

This skill is often used inside Hermes sessions.

## Secret location

For Hermes, store Paperless credentials in the active Hermes profile environment file, typically:

- `~/.hermes/.env`
- or `~/.hermes/profiles/<name>/.env` for a named profile

Use these variables:

```bash
PAPERLESS_URL=http://paperless-host:8000
PAPERLESS_TOKEN=...
```

Do not rely on clawdbot-specific config paths for Hermes sessions.

## Quick authenticated probe

A minimal access test is a GET against the documents endpoint:

```bash
curl -sS \
  -H "Authorization: Token $PAPERLESS_TOKEN" \
  "$PAPERLESS_URL/api/documents/?page_size=1"
```

Expected result:
- `200` with JSON when credentials are valid
- `401` if the token is missing or invalid

## What to check first

1. `PAPERLESS_URL` is set and includes the correct port.
2. `PAPERLESS_TOKEN` is present in the active Hermes `.env`.
3. The Paperless instance is reachable from the current host.
