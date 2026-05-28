import { ExitCode, LlmpdfError } from '../errors.js';
import { extractLlmContent } from '../pdf/show.js';
import { readPdfBytes } from '../fs.js';

export interface ShowArgs {
  pdf: string;
}

export async function runShow(args: ShowArgs): Promise<void> {
  try {
    const pdfBytes = await readPdfBytes(args.pdf);
    const content = await extractLlmContent(pdfBytes);
    if (!content) {
      console.error('✗ AI向けテキストは付与されていません');
      process.exit(ExitCode.ArgError);
      return;
    }
    process.stdout.write(
      `# 付与済みAI向けテキスト (${Buffer.byteLength(content, 'utf-8')} bytes)\n${content}\n`,
    );
    process.exit(ExitCode.Success);
  } catch (err) {
    if (err instanceof LlmpdfError) {
      console.error(err.message);
      process.exit(err.code);
    }
    console.error(`✗ エラー: ${String(err)}`);
    process.exit(ExitCode.PdfProcessingError);
  }
}
