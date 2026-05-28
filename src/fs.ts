import { readFile, writeFile, access } from 'node:fs/promises';
import { extname, basename } from 'node:path';
import { ExitCode, LlmpdfError } from './errors.js';

export function resolveOutputPath(inputPath: string, outputPath?: string): string {
  if (outputPath) return outputPath;
  const ext = extname(inputPath);
  if (ext.toLowerCase() === '.pdf') {
    return inputPath.slice(0, inputPath.length - ext.length) + '.llm.pdf';
  }
  return inputPath + '.llm.pdf';
}

export async function readPdfBytes(filePath: string): Promise<Uint8Array> {
  try {
    const buf = await readFile(filePath);
    return new Uint8Array(buf);
  } catch {
    throw new LlmpdfError(
      `✗ ファイルが見つかりません: ${basename(filePath)}`,
      ExitCode.FileReadError,
    );
  }
}

export async function readTextFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, 'utf-8');
  } catch {
    throw new LlmpdfError(
      `✗ ファイルが見つかりません: ${basename(filePath)}`,
      ExitCode.FileReadError,
    );
  }
}

export async function writeOutput(
  filePath: string,
  bytes: Uint8Array,
  overwrite: boolean,
): Promise<void> {
  if (!overwrite) {
    try {
      await access(filePath);
      throw new LlmpdfError(
        `✗ 出力先ファイルがすでに存在します: ${basename(filePath)}`,
        ExitCode.ArgError,
      );
    } catch (err) {
      if (err instanceof LlmpdfError) throw err;
    }
  }
  await writeFile(filePath, bytes);
}
