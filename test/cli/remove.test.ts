import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExitCode } from '../../src/errors.js';

vi.mock('../../src/pdf/remove.js', () => ({ removeLlmContent: vi.fn() }));
vi.mock('../../src/fs.js', () => ({
  readPdfBytes: vi.fn(),
  resolveOutputPath: vi.fn(),
  writeOutput: vi.fn(),
}));

import { removeLlmContent } from '../../src/pdf/remove.js';
import { readPdfBytes, resolveOutputPath, writeOutput } from '../../src/fs.js';
import { runRemove } from '../../src/commands/remove.js';

describe('runRemove', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as (code?: number) => never);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.mocked(readPdfBytes).mockResolvedValue(new Uint8Array([1, 2, 3]));
    vi.mocked(removeLlmContent).mockResolvedValue(new Uint8Array([4, 5, 6]));
    vi.mocked(resolveOutputPath).mockReturnValue('cleaned.pdf');
    vi.mocked(writeOutput).mockResolvedValue(undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  it('removes content and exits 0', async () => {
    await runRemove({ pdf: 'file.llm.pdf', output: undefined, overwrite: false });
    expect(writeOutput).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(ExitCode.Success);
  });
});
