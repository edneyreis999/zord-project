export class ValidationError extends Error {
  constructor(
    public readonly message = 'Validation error',
    public readonly code = 'VALIDATION_ERROR',
  ) {
    super(message);
  }
}
