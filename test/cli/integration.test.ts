import { describe, it, expect, beforeAll } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const CLI = join(import.meta.dirname, '../../dist/cli.js');
const FIXTURE = join(import.meta.dirname, '../fixtures/minimal.pdf');
const TMP = join(import.meta.dirname, '../fixtures/tmp');

function run(...args: string[]) {
  return spawnSync('node', [CLI, ...args], { encoding: 'utf-8' });
}

beforeAll(() => {
  mkdirSync(TMP, { recursive: true });
});

describe('integration: embed command', () => {
  it('exits 0 and creates output file', () => {
    const out = join(TMP, 'int-embed.llm.pdf');
    rmSync(out, { force: true });
    writeFileSync(join(TMP, 'note.txt'), 'integration test text');
    const result = run(FIXTURE, join(TMP, 'note.txt'), '--output', out);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('✓');
  });

  it('exits 1 when no text arg given', () => {
    const result = run(FIXTURE);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('✗');
  });

  it('exits 4 when PDF already has embedded text', () => {
    const out = join(TMP, 'int-already.llm.pdf');
    rmSync(out, { force: true });
    writeFileSync(join(TMP, 'note2.txt'), 'first embed');
    run(FIXTURE, join(TMP, 'note2.txt'), '--output', out);
    const result = run(out, join(TMP, 'note2.txt'));
    expect(result.status).toBe(4);
  });

  it('exits 0 with --overwrite when already embedded', () => {
    const out = join(TMP, 'int-overwrite.llm.pdf');
    rmSync(out, { force: true });
    writeFileSync(join(TMP, 'note3.txt'), 'first');
    run(FIXTURE, join(TMP, 'note3.txt'), '--output', out);
    const result = run(out, join(TMP, 'note3.txt'), '--overwrite', '--output', out);
    expect(result.status).toBe(0);
  });

  it('exits 2 when PDF file not found', () => {
    writeFileSync(join(TMP, 'note4.txt'), 'hi');
    const result = run('nonexistent.pdf', join(TMP, 'note4.txt'));
    expect(result.status).toBe(2);
  });

  it('exits 2 when text file not found', () => {
    const result = run(FIXTURE, 'nonexistent.txt');
    expect(result.status).toBe(2);
  });
});

describe('integration: show command', () => {
  it('shows embedded content and exits 0', () => {
    const out = join(TMP, 'int-show.llm.pdf');
    rmSync(out, { force: true });
    writeFileSync(join(TMP, 'show-note.txt'), 'show me this text');
    run(FIXTURE, join(TMP, 'show-note.txt'), '--output', out);
    const result = run('show', out);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('show me this text');
  });

  it('exits 1 when no embedded text', () => {
    const result = run('show', FIXTURE);
    expect(result.status).toBe(1);
  });
});

describe('integration: remove command', () => {
  it('removes embedded text and exits 0', () => {
    const embedded = join(TMP, 'int-remove.llm.pdf');
    const cleaned = join(TMP, 'int-cleaned.pdf');
    rmSync(embedded, { force: true });
    rmSync(cleaned, { force: true });
    writeFileSync(join(TMP, 'rem-note.txt'), 'to be removed');
    run(FIXTURE, join(TMP, 'rem-note.txt'), '--output', embedded);
    const result = run('remove', embedded, '--output', cleaned);
    expect(result.status).toBe(0);
    const showResult = run('show', cleaned);
    expect(showResult.status).toBe(1);
  });
});
