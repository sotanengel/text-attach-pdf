import { PDFDocument } from '@cantoo/pdf-lib';
import { LLM_FILENAME } from './detect.js';

export async function extractLlmContent(pdfBytes: Uint8Array): Promise<string | null> {
  const doc = await PDFDocument.load(pdfBytes);
  const attachment = doc.getAttachments().find((a) => a.name === LLM_FILENAME);
  if (!attachment) return null;
  return new TextDecoder().decode(attachment.data);
}
