import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { hasLlmContent } from '../../src/pdf/detect.js';
import { embedText } from '../../src/pdf/embed.js';

const FIXTURE = join(import.meta.dirname, '../fixtures/minimal.pdf');

describe('hasLlmContent', () => {
  it('returns false for a plain PDF', async () => {
    const bytes = await readFile(FIXTURE);
    expect(await hasLlmContent(new Uint8Array(bytes))).toBe(false);
  });

  it('returns true after embedding text', async () => {
    const bytes = await readFile(FIXTURE);
    const embedded = await embedText(new Uint8Array(bytes), 'hello');
    expect(await hasLlmContent(embedded)).toBe(true);
  });
});
