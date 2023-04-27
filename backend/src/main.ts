import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  BadRequestException,
  HttpException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import helmet from 'helmet';
import { ValidationError, useContainer } from 'class-validator';

function extractErrorMessages(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }

    if (error.children && error.children.length > 0) {
      messages.push(...extractErrorMessages(error.children));
    }
  }

  return messages;
}

// Configure Swagger for the application
export async function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Title')
    .setDescription('API Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

export async function configureValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 400,
      exceptionFactory: (errors) => {
        const message = extractErrorMessages(errors).join('; ');

        // Encontre o primeiro erro que possui um código de status personalizado
        const errorWithStatusCode = errors.find((error) => {
          return (
            error.constraints &&
            Object.values(error.constraints).some((constraint) => {
              return (constraint as any).statusCode !== undefined;
            })
          );
        });

        // Se um erro com código de status personalizado for encontrado, use-o para criar a exceção
        if (errorWithStatusCode) {
          const constraintWithStatusCode = Object.values(
            errorWithStatusCode.constraints,
          ).find((constraint) => {
            return (constraint as any).statusCode !== undefined;
          });
          return new HttpException(
            message,
            (constraintWithStatusCode as any).statusCode,
          );
        }

        // Caso contrário, retorne a exceção padrão (BadRequestException)
        return new BadRequestException(message);
      },
    }),
  );
  app.use(helmet());
}

// Start the NestJS application with Swagger and specified port
export async function startApp(port: number, appModule: AppModule) {
  const app = await NestFactory.create(appModule);
  await configureSwagger(app);
  await configureValidationPipe(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port);
}

// Call the startApp function to initialize the application with specified port and AppModule
startApp(5000, AppModule);
