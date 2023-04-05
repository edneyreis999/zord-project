import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

describe('Main', () => {
  it('should bootstrap the app and start listening on port 5000', async () => {
    const mockApp = { listen: jest.fn() };
    const createAppSpy = jest
      .spyOn(NestFactory, 'create')
      .mockResolvedValue(mockApp as any);

    await import('./main');

    expect(createAppSpy).toHaveBeenCalledWith(AppModule);
    expect(mockApp.listen).toHaveBeenCalledWith(5000);
  });
});
