import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ValidationError } from '../exceptions';
import { ValidationErrorInterceptor } from './validation-error.interceptor';

describe('ValidationErrorInterceptor', () => {
  let interceptor: ValidationErrorInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationErrorInterceptor],
    }).compile();

    interceptor = module.get<ValidationErrorInterceptor>(
      ValidationErrorInterceptor,
    );
  });

  it('should return an Observable with the original value when no error is thrown', (done) => {
    const originalValue = 'test';
    const callHandler = {
      handle: jest.fn().mockReturnValue(of(originalValue)),
    };

    interceptor.intercept(null, callHandler as any).subscribe((data) => {
      expect(data).toBe(originalValue);
      done();
    });
  });

  it('should catch a ValidationError and throw a BadRequestException', (done) => {
    const errorMessage = 'Invalid input data';
    const callHandler = {
      handle: jest
        .fn()
        .mockReturnValue(throwError(() => new ValidationError(errorMessage))),
    };

    interceptor
      .intercept(null, callHandler as any)
      .pipe(catchError((err) => throwError(() => err)))
      .subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toBe(errorMessage);
          done();
        },
      });
  });

  it('should rethrow an error that is not a ValidationError', (done) => {
    const errorMessage = 'An unexpected error occurred';
    const callHandler = {
      handle: jest
        .fn()
        .mockReturnValue(throwError(() => new Error(errorMessage))),
    };

    interceptor
      .intercept(null, callHandler as any)
      .pipe(catchError((err) => throwError(() => err)))
      .subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBe(errorMessage);
          done();
        },
      });
  });
});
