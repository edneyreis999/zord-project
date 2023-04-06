import { of, lastValueFrom } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { NotFoundInterceptor } from './not-found.interceptor';

describe('NotFoundInterceptor', () => {
  let interceptor: NotFoundInterceptor;
  let executionContext: ExecutionContext;
  let next: CallHandler;

  beforeEach(() => {
    interceptor = new NotFoundInterceptor();
    next = { handle: () => of(null) } as CallHandler;
    executionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/',
        }),
      }),
    } as ExecutionContext;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should throw NotFoundException when data is null', async () => {
    try {
      await lastValueFrom(interceptor.intercept(executionContext, next));
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should not throw NotFoundException when data is not null', async () => {
    next.handle = () => of({});

    try {
      await lastValueFrom(interceptor.intercept(executionContext, next));
    } catch (error) {
      expect(error).not.toBeInstanceOf(NotFoundException);
    }
  });
});
