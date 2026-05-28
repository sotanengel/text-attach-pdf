import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExitCode } from '../../src/errors.js';

vi.mock('../../src/pdf/detect.js', () => ({ hasLlmContent: vi.fn() }));
vi.mock('../../src/pdf/embed.js', () => ({ embedText: vi.fn() }));
vi.mock('../../src/fs.js', () => ({
  readPdfBytes: vi.fn(),
  readTextFile: vi.fn(),
  resolveOutputPath: vi.fn(),
  writeOutput: vi.fn(),
}));

import { hasLlmContent } from '../../src/pdf/detect.js';
import { embedText } from '../../src/pdf/embed.js';
import { readPdfBytes, readTextFile, resolveOutputPath, writeOutput } from '../../src/fs.js';
import { runEmbed } from '../../src/commands/embed.js';

describe('runEmbed', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as (code?: number) => never);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(readPdfBytes).mockResolvedValue(new Uint8Array([1, 2, 3]));
    vi.mocked(readTextFile).mockResolvedValue('sample text');
    vi.mocked(hasLlmContent).mockResolvedValue(false);
    vi.mocked(embedText).mockResolvedValue(new Uint8Array([4, 5, 6]));
    vi.mocked(resolveOutputPath).mockReturnValue('output.llm.pdf');
    vi.mocked(writeOutput).mockResolvedValue(undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  it('exits 1 when neither text_file nor --text is provided', async () => {
    await runEmbed({
      pdf: 'input.pdf',
      text_file: undefined,
      text: undefined,
      output: undefined,
      overwrite: false,
    });
    expect(exitSpy).toHaveBeenCalledWith(ExitCode.ArgError);
  });

  it('exits 4 when PDF already has embedded text and --overwrite is not set', async () => {
    vi.mocked(hasLlmContent).mockResolvedValue(true);
    await runEmbed({
      pdf: 'input.pdf',
      text_file: 'notes.txt',
      text: undefined,
      output: undefined,
      overwrite: false,
    });
    expect(exitSpy).toHaveBeenCalledWith(ExitCode.AlreadyEmbedded);
  });

  it('succeeds and exits 0 on happy path with text_file', async () => {
    await runEmbed({
      pdf: 'input.pdf',
      text_file: 'notes.txt',
      text: undefined,
      output: undefined,
      overwrite: false,
    });
    expect(writeOutput).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(ExitCode.Success);
  });

  it('succeeds and exits 0 on happy path with --text', async () => {
    await runEmbed({
      pdf: 'input.pdf',
      text_file: undefined,
      text: 'inline text',
      output: undefined,
      overwrite: false,
    });
    expect(writeOutput).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(ExitCode.Success);
  });

  it('allows overwrite when --overwrite flag is set', async () => {
    vi.mocked(hasLlmContent).mockResolvedValue(true);
    await runEmbed({
      pdf: 'input.pdf',
      text_file: 'notes.txt',
      text: undefined,
      output: undefined,
      overwrite: true,
    });
    expect(writeOutput).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(ExitCode.Success);
  });
});
