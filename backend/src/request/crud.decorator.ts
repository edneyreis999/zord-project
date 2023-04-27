import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  applyDecorators,
  UsePipes,
  ValidationPipe,
  Type,
  Get,
  Post,
  Put,
  Delete,
  UseInterceptors,
  Patch,
  HttpCode,
} from '@nestjs/common';
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
        transform: true,
        transformOptions: { excludeExtraneousValues: true }, // enforce type-safe instance
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
        transform: true,
        transformOptions: { excludeExtraneousValues: true }, // enforce type-safe instance
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
    UsePipes(new ValidationPipe()),
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
    UsePipes(new ValidationPipe()),
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
    UsePipes(new ValidationPipe()),
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
    ApiNoContentResponse({
      description: 'The resource has been successfully deleted',
    }),
    ApiBadGatewayResponse({ description: 'Unable to delete resource' }),
  );
}
