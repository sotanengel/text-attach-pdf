import { describe, it, expect, vi, afterEach } from 'vitest';
import { ExitCode, LlmpdfError } from '../src/errors.js';
import { resolveOutputPath } from '../src/fs.js';

vi.mock('node:fs/promises');

describe('resolveOutputPath', () => {
  afterEach(() => vi.resetAllMocks());

  it('appends .llm.pdf when no output given', () => {
    expect(resolveOutputPath('input.pdf')).toBe('input.llm.pdf');
  });

  it('replaces .pdf extension when input has uppercase extension', () => {
    expect(resolveOutputPath('doc.PDF')).toBe('doc.llm.pdf');
  });

  it('returns the given output path when specified', () => {
    expect(resolveOutputPath('input.pdf', 'out.pdf')).toBe('out.pdf');
  });

  it('handles files without .pdf extension', () => {
    expect(resolveOutputPath('file')).toBe('file.llm.pdf');
  });
});

describe('LlmpdfError', () => {
  it('carries the exit code', () => {
    const err = new LlmpdfError('test', ExitCode.FileReadError);
    expect(err.code).toBe(ExitCode.FileReadError);
    expect(err.message).toBe('test');
    expect(err.name).toBe('LlmpdfError');
  });

  it('is an instance of Error', () => {
    expect(new LlmpdfError('', ExitCode.Success)).toBeInstanceOf(Error);
  });
});
