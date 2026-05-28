import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { extractLlmContent } from '../../src/pdf/show.js';
import { embedText } from '../../src/pdf/embed.js';

const FIXTURE = join(import.meta.dirname, '../fixtures/minimal.pdf');

describe('extractLlmContent', () => {
  it('returns null for a PDF with no embedded text', async () => {
    const bytes = new Uint8Array(await readFile(FIXTURE));
    expect(await extractLlmContent(bytes)).toBeNull();
  });

  it('returns the embedded text', async () => {
    const bytes = new Uint8Array(await readFile(FIXTURE));
    const text = 'extracted content test';
    const embedded = await embedText(bytes, text);
    expect(await extractLlmContent(embedded)).toBe(text);
  });

  it('handles multiline and multibyte text', async () => {
    const bytes = new Uint8Array(await readFile(FIXTURE));
    const text = '日本語\nline2\nline3';
    const embedded = await embedText(bytes, text);
    expect(await extractLlmContent(embedded)).toBe(text);
  });
});
