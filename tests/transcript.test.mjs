import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { condense, list, turns } from '../skills/loot/scripts/transcript.mjs';
import { remind } from '../hooks/remind.mjs';

const AWS = 'AKIA' + 'ABCDEFGHIJKLMNOP';
const jsonl = (rows) => rows.map((r) => JSON.stringify(r)).join('\n') + '\n';

const claude = jsonl([
  { type: 'user', isCompactSummary: true, message: { role: 'user', content: 'Earlier: set up the repo.' } },
  { type: 'user', message: { role: 'user', content: 'make the export faster' } },
  { type: 'assistant', message: { role: 'assistant', content: [{ type: 'thinking', thinking: 'hidden' }, { type: 'text', text: 'Trying two-pass encoding.' }, { type: 'tool_use', name: 'Bash', input: {} }, { type: 'tool_use', name: 'Edit', input: {} }] } },
  { type: 'user', message: { role: 'user', content: [{ type: 'tool_result', content: 'big output' }] } },
  { type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: `Key was ${AWS}, removed it.` }] } },
  { type: 'cost-state' },
  'not json',
]);
const codex = jsonl([
  { type: 'session_meta', payload: { id: 'x' } },
  { type: 'response_item', payload: { type: 'message', role: 'developer', content: [{ type: 'input_text', text: 'system rules' }] } },
  { type: 'response_item', payload: { type: 'message', role: 'user', content: [{ type: 'input_text', text: '<environment_context>cwd</environment_context>' }] } },
  { type: 'response_item', payload: { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'fix the parser' }] } },
  { type: 'response_item', payload: { type: 'function_call', name: 'shell' } },
  { type: 'response_item', payload: { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'Fixed.' }] } },
]);

const home = mkdtempSync(join(tmpdir(), 'loot-home-'));
mkdirSync(join(home, '.claude', 'projects', 'proj'), { recursive: true });
mkdirSync(join(home, '.codex', 'sessions', '2026', '10', '12'), { recursive: true });
const claudeFile = join(home, '.claude', 'projects', 'proj', 'a.jsonl');
const codexFile = join(home, '.codex', 'sessions', '2026', '10', '12', 'rollout-b.jsonl');
writeFileSync(claudeFile, claude);
writeFileSync(codexFile, codex);

test('reads Claude Code transcripts: text, tool names, summaries; skips thinking and tool output', () => {
  assert.deepEqual(turns(claudeFile).map((t) => `${t.role}:${t.text}`), [
    'summary:Earlier: set up the repo.',
    'user:make the export faster',
    'assistant:Trying two-pass encoding.',
    'tool:Bash',
    'tool:Edit',
    `assistant:Key was ${AWS}, removed it.`,
  ]);
});

test('reads Codex transcripts and skips developer and environment messages', () => {
  assert.deepEqual(turns(codexFile).map((t) => `${t.role}:${t.text}`), ['user:fix the parser', 'tool:shell', 'assistant:Fixed.']);
});

test('reads the task a Codex sub-agent got from its parent', () => {
  const file = join(home, 'sub.jsonl');
  writeFileSync(file, jsonl([{ type: 'response_item', payload: { type: 'agent_message', author: 'parent', content: [{ type: 'input_text', text: 'audit the cache' }] } }]));
  assert.deepEqual(turns(file), [{ role: 'user', text: 'audit the cache' }]);
});

test('condense groups tool calls, redacts secrets and keeps both ends when cut', () => {
  const text = condense(claudeFile);
  assert.match(text, /## summary of earlier conversation/);
  assert.match(text, /· tools: Bash, Edit/);
  assert.match(text, /Key was \[redacted\], removed it\./);
  assert.doesNotMatch(text, /hidden|big output|AKIA/);
  const cut = condense(claudeFile, 60);
  assert.match(cut, /^## summary/);
  assert.match(cut, /characters cut/);
  assert.match(cut, /removed it\.$/);
});

test('reads a Markdown export from any other agent, redacted', () => {
  const file = join(home, 'cursor-export.md');
  writeFileSync(file, `# Chat\n\n**User:** use key ${AWS}\n\n**Assistant:** done\n`);
  const text = condense(file);
  assert.match(text, /\*\*User:\*\* use key \[redacted\]/);
  assert.match(text, /\*\*Assistant:\*\* done/);
});

test('list finds both agents, newest first, with the first prompt', () => {
  const sessions = list(home);
  assert.deepEqual(sessions.map((s) => s.agent).sort(), ['claude', 'codex']);
  assert.ok(sessions.some((s) => s.first === 'make the export faster'));
  assert.ok(sessions.some((s) => s.first === 'fix the parser'));
});

test('reminder is off by default, needs a long session, and fires once', () => {
  const dir = mkdtempSync(join(tmpdir(), 'loot-remind-'));
  const long = join(dir, 'long.jsonl');
  writeFileSync(long, jsonl(Array.from({ length: 30 }, (_, i) => ({ type: 'user', message: { role: 'user', content: `msg ${i}` } }))));
  const input = { session_id: 's1', transcript_path: long };
  assert.equal(remind(input, {}, dir), null);
  assert.equal(remind({ session_id: 's0', transcript_path: claudeFile }, { LOOT_REMIND: '1' }, dir), null);
  assert.match(remind(input, { LOOT_REMIND: '1' }, dir), /Long session \(30 messages\)/);
  assert.equal(remind(input, { LOOT_REMIND: '1' }, dir), null);
});
