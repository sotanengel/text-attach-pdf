import { PDFDocument } from '@cantoo/pdf-lib';
import { LLM_FILENAME } from './detect.js';

export async function removeLlmContent(pdfBytes: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  doc.detach(LLM_FILENAME);
  return doc.save();
}
