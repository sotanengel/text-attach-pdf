import { PDFDocument } from '@cantoo/pdf-lib';
import { writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const FIXTURE_PATH = join(import.meta.dirname, 'fixtures', 'minimal.pdf');

export async function setup() {
  try {
    await access(FIXTURE_PATH);
  } catch {
    const doc = await PDFDocument.create();
    doc.addPage();
    const bytes = await doc.save();
    await writeFile(FIXTURE_PATH, bytes);
  }
}
