import { ExitCode, LlmpdfError } from '../errors.js';
import { hasLlmContent } from '../pdf/detect.js';
import { embedText } from '../pdf/embed.js';
import { readPdfBytes, readTextFile, resolveOutputPath, writeOutput } from '../fs.js';

export interface EmbedArgs {
  pdf: string;
  text_file: string | undefined;
  text: string | undefined;
  output: string | undefined;
  overwrite: boolean;
}

export async function runEmbed(args: EmbedArgs): Promise<void> {
  try {
    if (!args.text_file && !args.text) {
      console.error('✗ エラー: テキストファイルのパスまたは --text オプションを指定してください');
      process.exit(ExitCode.ArgError);
      return;
    }

    const pdfBytes = await readPdfBytes(args.pdf);

    const text = args.text ?? (await readTextFile(args.text_file!));

    if (!args.overwrite && (await hasLlmContent(pdfBytes))) {
      console.error(
        '✗ エラー: このPDFにはすでにAI向けテキストが付与されています\n  上書きするには --overwrite を使用してください',
      );
      process.exit(ExitCode.AlreadyEmbedded);
      return;
    }

    const result = await embedText(pdfBytes, text);
    const outputPath = resolveOutputPath(args.pdf, args.output);

    await writeOutput(outputPath, result, args.overwrite);
    console.log(`✓ AI向けテキストを付与しました: ${outputPath}`);
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
