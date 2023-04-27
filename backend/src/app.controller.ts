import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get('/helthcheck')
  getHello(): string {
    return `Hello World! from ${process.env.NODE_ENV}`;
  }
}
