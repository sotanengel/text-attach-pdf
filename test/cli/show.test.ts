import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExitCode } from '../../src/errors.js';

vi.mock('../../src/pdf/show.js', () => ({ extractLlmContent: vi.fn() }));
vi.mock('../../src/fs.js', () => ({ readPdfBytes: vi.fn() }));

import { extractLlmContent } from '../../src/pdf/show.js';
import { readPdfBytes } from '../../src/fs.js';
import { runShow } from '../../src/commands/show.js';

describe('runShow', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>;
  let outSpy: ReturnType<typeof vi.spyOn>;
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as (code?: number) => never);
    outSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(readPdfBytes).mockResolvedValue(new Uint8Array([1, 2, 3]));
  });

  afterEach(() => vi.restoreAllMocks());

  it('prints the embedded content and exits 0', async () => {
    vi.mocked(extractLlmContent).mockResolvedValue('hello content');
    await runShow({ pdf: 'file.pdf' });
    expect(outSpy).toHaveBeenCalledWith(expect.stringContaining('hello content'));
    expect(exitSpy).toHaveBeenCalledWith(ExitCode.Success);
  });

  it('prints error and exits 1 when no content found', async () => {
    vi.mocked(extractLlmContent).mockResolvedValue(null);
    await runShow({ pdf: 'file.pdf' });
    expect(errSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(ExitCode.ArgError);
  });
});
