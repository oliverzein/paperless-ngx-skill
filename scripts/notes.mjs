#!/usr/bin/env node
/**
 * List or add notes for a Paperless-ngx document
 * Usage: node notes.mjs <document-id> [--add "note text"]
 */

import { parseArgs } from 'node:util';

const PAPERLESS_URL = process.env.PAPERLESS_URL;
const PAPERLESS_TOKEN = process.env.PAPERLESS_TOKEN;

if (!PAPERLESS_URL || !PAPERLESS_TOKEN) {
  console.error(JSON.stringify({ error: 'PAPERLESS_URL and PAPERLESS_TOKEN must be set' }));
  process.exit(1);
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    add: { type: 'string', short: 'a' },
    help: { type: 'boolean', short: 'h' }
  }
});

if (values.help || positionals.length === 0) {
  console.log(`Usage: notes.mjs <document-id> [options]
  
Options:
  -a, --add <text>   Add a note to the document
  -h, --help         Show this help`);
  process.exit(values.help ? 0 : 1);
}

const baseUrl = PAPERLESS_URL.replace(/\/$/, '');
const headers = { 'Authorization': `Token ${PAPERLESS_TOKEN}` };

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

function normalizeNotes(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.notes)) return payload.notes;
  return payload ? [payload] : [];
}

async function main() {
  const docId = positionals[0];
  const endpoint = `${baseUrl}/api/documents/${docId}/notes/`;

  if (values.add) {
    const created = await fetchJson(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: values.add })
    });

    console.log(JSON.stringify({
      success: true,
      action: 'add',
      document_id: docId,
      note: created,
    }, null, 2));
    return;
  }

  const data = await fetchJson(endpoint);
  const notes = normalizeNotes(data).map(note => ({
    id: note.id ?? null,
    note: note.note ?? note.text ?? note.content ?? note.body ?? note,
    created: note.created ?? note.added ?? note.modified ?? null,
    user: note.user ?? note.owner ?? null,
  }));

  console.log(JSON.stringify({
    success: true,
    action: 'list',
    document_id: docId,
    count: notes.length,
    notes,
  }, null, 2));
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }));
  process.exit(1);
});
