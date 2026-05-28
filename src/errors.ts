export enum ExitCode {
  Success = 0,
  ArgError = 1,
  FileReadError = 2,
  PdfProcessingError = 3,
  AlreadyEmbedded = 4,
}

export class LlmpdfError extends Error {
  constructor(
    message: string,
    public readonly code: ExitCode,
  ) {
    super(message);
    this.name = 'LlmpdfError';
  }
}
