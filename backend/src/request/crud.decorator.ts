import {
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
  Type,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { NotFoundInterceptor } from './not-found.interceptor';
import { ValidationErrorInterceptor } from './validation-error.interceptor';

export type ResourceType = Type<unknown> | string;

export interface ChangeOptions {
  input: ResourceType;
  output: ResourceType;
}

export function CrudGetOne(path: string | string[], output: ResourceType) {
  return applyDecorators(
    Get(path),
    UsePipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    ),
    UseInterceptors(NotFoundInterceptor),
    ApiNotFoundResponse({ description: 'Resource not found' }),
    ApiOkResponse({ type: output }),
  );
}

export function CrudGetAll(path: string | string[], output: ResourceType) {
  return applyDecorators(
    Get(path),
    UsePipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    ),
    ApiOkResponse({ type: output, isArray: true }),
  );
}

export function CrudPost(path: string | string[], options: ChangeOptions) {
  return applyDecorators(
    Post(path),
    UseInterceptors(ValidationErrorInterceptor),
    ApiBody({ type: options.input }),
    UsePipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    ),
    ApiCreatedResponse({ type: options.output }),
    ApiBadRequestResponse({ description: 'The payload is invalid' }),
    ApiNotFoundResponse({ description: 'Resource was not found' }),
    ApiBadGatewayResponse({ description: 'Unable to create resource' }),
  );
}

export function CrudPut(path: string | string[], options: ChangeOptions) {
  return applyDecorators(
    Put(path),
    UseInterceptors(ValidationErrorInterceptor),
    ApiBody({ type: options.input }),
    UsePipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    ),
    ApiCreatedResponse({ type: options.output }),
    ApiBadRequestResponse({ description: 'The payload is invalid' }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
    ApiBadGatewayResponse({ description: 'Unable to update resource' }),
  );
}

export function CrudPatch(path: string | string[], options: ChangeOptions) {
  return applyDecorators(
    Patch(path),
    UseInterceptors(ValidationErrorInterceptor),
    ApiBody({ type: options.input }),
    UsePipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    ),
    ApiCreatedResponse({ type: options.output }),
    ApiBadRequestResponse({ description: 'The payload is invalid' }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
    ApiBadGatewayResponse({ description: 'Unable to update resource' }),
  );
}

export function CrudDelete(path: string | string[]) {
  return applyDecorators(
    Delete(path),
    HttpCode(204),
    UsePipes(new ValidationPipe()),
    UseInterceptors(ValidationErrorInterceptor),
    ApiNoContentResponse({
      description: 'The resource has been successfully deleted',
    }),
    ApiBadGatewayResponse({ description: 'Unable to delete resource' }),
  );
}
