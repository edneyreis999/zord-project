import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

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

// Start the NestJS application with Swagger and specified port
export async function startApp(port: number, appModule: AppModule) {
  const app = await NestFactory.create(appModule);
  await configureSwagger(app);
  await app.listen(port);
}

// Call the startApp function to initialize the application with specified port and AppModule
startApp(5000, AppModule);
