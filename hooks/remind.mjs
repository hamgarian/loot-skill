#!/usr/bin/env node
// Stop hook: once per long session, suggest running /loot. Never runs it.
// Off unless LOOT_REMIND=1 (set it under "env" in ~/.claude/settings.json).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { turns } from '../skills/loot/scripts/transcript.mjs';

const MIN_MESSAGES = 30;

// Returns the reminder text, or null when there's nothing to say.
export function remind(input, env = process.env, dir = tmpdir()) {
  if (env.LOOT_REMIND !== '1' || !input.transcript_path || !existsSync(input.transcript_path)) return null;
  const marker = join(dir, `loot-reminded-${String(input.session_id ?? 'unknown').replace(/[^\w-]/g, '')}`);
  if (existsSync(marker)) return null;
  const messages = turns(input.transcript_path).filter((t) => t.role === 'user' || t.role === 'assistant').length;
  if (messages < MIN_MESSAGES) return null;
  writeFileSync(marker, '');
  return `Long session (${messages} messages). Anything worth keeping? Run /loot (or /loot --auto to just journal it).`;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try {
    const message = remind(JSON.parse(readFileSync(0, 'utf8') || '{}'));
    if (message) console.log(JSON.stringify({ systemMessage: message }));
  } catch {
    // A reminder must never break the session.
  }
}
