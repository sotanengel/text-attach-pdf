import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { PDFDocument } from '@cantoo/pdf-lib';
import { embedText } from '../../src/pdf/embed.js';
import { LLM_FILENAME } from '../../src/pdf/detect.js';

const FIXTURE = join(import.meta.dirname, '../fixtures/minimal.pdf');

describe('embedText', () => {
  it('embeds text as an attachment named llm-content.txt', async () => {
    const bytes = new Uint8Array(await readFile(FIXTURE));
    const result = await embedText(bytes, 'test content');
    const doc = await PDFDocument.load(result);
    const attachments = doc.getAttachments();
    expect(attachments).toHaveLength(1);
    expect(attachments[0]?.name).toBe(LLM_FILENAME);
  });

  it('preserves the embedded text verbatim', async () => {
    const bytes = new Uint8Array(await readFile(FIXTURE));
    const text = 'マルチバイト: 日本語テスト\nline2';
    const result = await embedText(bytes, text);
    const doc = await PDFDocument.load(result);
    const attachment = doc.getAttachments()[0];
    expect(new TextDecoder().decode(attachment?.data)).toBe(text);
  });

  it('sets mimeType to text/plain; charset=utf-8', async () => {
    const bytes = new Uint8Array(await readFile(FIXTURE));
    const result = await embedText(bytes, 'hello');
    const doc = await PDFDocument.load(result);
    const attachment = doc.getAttachments()[0];
    expect(attachment?.mimeType).toBe('text/plain; charset=utf-8');
  });

  it('does not modify original bytes', async () => {
    const raw = await readFile(FIXTURE);
    const bytes = new Uint8Array(raw);
    const original = new Uint8Array(raw);
    await embedText(bytes, 'hello');
    expect(bytes).toEqual(original);
  });
});
