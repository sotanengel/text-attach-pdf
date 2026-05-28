import { PDFDocument } from '@cantoo/pdf-lib';

export const LLM_FILENAME = 'llm-content.txt';

export async function hasLlmContent(pdfBytes: Uint8Array): Promise<boolean> {
  const doc = await PDFDocument.load(pdfBytes);
  return doc.getAttachments().some((a) => a.name === LLM_FILENAME);
}
