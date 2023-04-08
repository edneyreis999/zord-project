import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    type: String,
    description: 'Book name',
    example: 'Book 1',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;
}
