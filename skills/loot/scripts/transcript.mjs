#!/usr/bin/env node
// Read past agent sessions so loot can scan them, not just the live conversation.
// Usage: node transcript.mjs list [--limit 15]
//        node transcript.mjs read <session.jsonl> [--max-chars 120000]
// Supports Claude Code (~/.claude/projects) and Codex (~/.codex/sessions). Secrets are redacted.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PATTERNS } from './scan.mjs';

const redact = (text) => PATTERNS.reduce((t, [, re]) => t.replace(new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`), '[redacted]'), text);
const parse = (file) => readFileSync(file, 'utf8').split('\n').flatMap((l) => { try { return l ? [JSON.parse(l)] : []; } catch { return []; } });

// Returns [{ role: 'user'|'assistant'|'tool'|'summary', text }].
export function turns(file) {
  const out = [];
  for (const o of parse(file)) {
    if (o.type === 'user' || o.type === 'assistant') {
      const c = o.message?.content;
      if (o.isCompactSummary) out.push({ role: 'summary', text: typeof c === 'string' ? c : '' });
      else if (typeof c === 'string') out.push({ role: o.type, text: c });
      else for (const part of c ?? []) {
        if (part.type === 'text') out.push({ role: o.type, text: part.text });
        else if (part.type === 'tool_use') out.push({ role: 'tool', text: part.name });
      }
    } else if (o.type === 'response_item') {
      const p = o.payload ?? {};
      if (p.type === 'message' && (p.role === 'user' || p.role === 'assistant')) {
        const text = (p.content ?? []).filter((x) => x.type === 'input_text' || x.type === 'output_text').map((x) => x.text).join('\n');
        if (text && !text.startsWith('<environment_context')) out.push({ role: p.role, text });
      } else if (p.type === 'agent_message') {
        // Codex sub-agent sessions get their task from the parent agent, not the user.
        out.push({ role: 'user', text: (p.content ?? []).map((x) => x.text ?? '').join('\n') });
      } else if (p.type === 'function_call' || p.type === 'custom_tool_call') out.push({ role: 'tool', text: p.name });
    }
  }
  return out.filter((t) => t.text?.trim());
}

// Condensed, redacted text: user and assistant messages in full, tool calls as one line each.
// A non-JSONL file (a Markdown or text export from any other agent) is passed through, redacted.
export function condense(file, maxChars = 120_000) {
  if (!file.endsWith('.jsonl')) return cut(redact(readFileSync(file, 'utf8')), maxChars);
  const lines = [];
  for (const t of turns(file)) {
    if (t.role === 'tool') {
      const last = lines.at(-1);
      if (last?.startsWith('· tools: ')) lines[lines.length - 1] = `${last}, ${t.text}`;
      else lines.push(`· tools: ${t.text}`);
    } else lines.push(`## ${t.role === 'summary' ? 'summary of earlier conversation' : t.role}\n${t.text.trim()}`);
  }
  return cut(redact(lines.join('\n\n')), maxChars);
}

// Keep the start (the goal) and the end (where it landed) when a session is too long.
const cut = (text, maxChars) =>
  text.length > maxChars ? `${text.slice(0, maxChars / 2)}\n\n[… ${text.length - maxChars} characters cut …]\n\n${text.slice(-maxChars / 2)}` : text;

const jsonl = (dir, depth) => {
  let files = [];
  try {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory() && depth > 0) files = files.concat(jsonl(p, depth - 1));
      else if (e.isFile() && e.name.endsWith('.jsonl')) files.push(p);
    }
  } catch { /* agent not installed */ }
  return files;
};

export function list(home = homedir(), limit = 15) {
  const sessions = [
    ...jsonl(join(home, '.claude', 'projects'), 1).map((file) => ({ agent: 'claude', file })),
    ...jsonl(join(home, '.codex', 'sessions'), 4).map((file) => ({ agent: 'codex', file })),
  ];
  return sessions
    .map((s) => ({ ...s, mtime: statSync(s.file).mtime }))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, limit)
    .map((s) => {
      const first = turns(s.file).find((t) => t.role === 'user')?.text ?? '';
      return { ...s, first: redact(first.replace(/\s+/g, ' ').slice(0, 90)) };
    });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [cmd, arg] = process.argv.slice(2);
  const flag = (name, def) => { const i = process.argv.indexOf(name); return i > 0 ? Number(process.argv[i + 1]) : def; };
  if (cmd === 'list') {
    for (const s of list(homedir(), flag('--limit', 15))) console.log(`${s.mtime.toISOString().slice(0, 16)}  ${s.agent.padEnd(6)}  ${s.first}\n    ${s.file}`);
  } else if (cmd === 'read' && arg) {
    console.log(condense(arg, flag('--max-chars', 120_000)));
  } else {
    console.error('usage: transcript.mjs list [--limit N] | read <session.jsonl> [--max-chars N]');
    process.exit(2);
  }
}
