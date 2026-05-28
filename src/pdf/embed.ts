import { PDFDocument, AFRelationship } from '@cantoo/pdf-lib';
import { LLM_FILENAME } from './detect.js';

export async function embedText(pdfBytes: Uint8Array, text: string): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const encoded = new TextEncoder().encode(text);
  await doc.attach(encoded, LLM_FILENAME, {
    mimeType: 'text/plain; charset=utf-8',
    afRelationship: AFRelationship.Alternative,
    description: 'LLM-readable content',
  });
  return doc.save();
}
