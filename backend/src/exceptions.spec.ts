import { ValidationError } from './exceptions';

describe('ValidationError', () => {
  it('should be defined', () => {
    const error = new ValidationError();
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
  });

  it('should set message and code properties', () => {
    const message = 'Invalid input';
    const code = 'INVALID_INPUT';
    const error = new ValidationError(message, code);

    expect(error.message).toEqual(message);
    expect(error.code).toEqual(code);
  });
});
