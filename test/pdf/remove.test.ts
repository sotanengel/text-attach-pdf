import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { PDFDocument } from '@cantoo/pdf-lib';
import { removeLlmContent } from '../../src/pdf/remove.js';
import { embedText } from '../../src/pdf/embed.js';
import { hasLlmContent } from '../../src/pdf/detect.js';

const FIXTURE = join(import.meta.dirname, '../fixtures/minimal.pdf');

describe('removeLlmContent', () => {
  it('removes the embedded text attachment', async () => {
    const bytes = new Uint8Array(await readFile(FIXTURE));
    const embedded = await embedText(bytes, 'to be removed');
    const cleaned = await removeLlmContent(embedded);
    expect(await hasLlmContent(cleaned)).toBe(false);
  });

  it('produces a valid PDF after removal', async () => {
    const bytes = new Uint8Array(await readFile(FIXTURE));
    const embedded = await embedText(bytes, 'hello');
    const cleaned = await removeLlmContent(embedded);
    await expect(PDFDocument.load(cleaned)).resolves.toBeTruthy();
  });

  it('round-trip: embed → detect(true) → remove → detect(false)', async () => {
    const bytes = new Uint8Array(await readFile(FIXTURE));
    expect(await hasLlmContent(bytes)).toBe(false);
    const embedded = await embedText(bytes, 'round trip');
    expect(await hasLlmContent(embedded)).toBe(true);
    const cleaned = await removeLlmContent(embedded);
    expect(await hasLlmContent(cleaned)).toBe(false);
  });
});
