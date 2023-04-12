import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import helmet from 'helmet';

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
        const message = errors
          .map((error) => Object.values(error.constraints).join('; '))
          .join('; ');
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
  await app.listen(port);
}

// Call the startApp function to initialize the application with specified port and AppModule
startApp(5000, AppModule);
