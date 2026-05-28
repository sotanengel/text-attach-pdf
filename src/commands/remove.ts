import { ExitCode, LlmpdfError } from '../errors.js';
import { removeLlmContent } from '../pdf/remove.js';
import { readPdfBytes, resolveOutputPath, writeOutput } from '../fs.js';

export interface RemoveArgs {
  pdf: string;
  output: string | undefined;
  overwrite: boolean;
}

export async function runRemove(args: RemoveArgs): Promise<void> {
  try {
    const pdfBytes = await readPdfBytes(args.pdf);
    const result = await removeLlmContent(pdfBytes);
    const outputPath = resolveOutputPath(args.pdf, args.output);
    await writeOutput(outputPath, result, args.overwrite);
    console.log(`✓ AI向けテキストを削除しました: ${outputPath}`);
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
