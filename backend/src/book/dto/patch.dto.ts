import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsMongoId, IsString } from 'class-validator';
import { CreateBookDto } from './create.dto';

export class UpdateBookDto extends CreateBookDto {
  @ApiProperty({
    name: 'id',
    description: 'Chapter id (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsDefined()
  @Expose()
  @IsMongoId({
    message: 'id invalid',
  })
  id: string;
}

export class PatchBookDto extends PartialType(
  OmitType(UpdateBookDto, ['id'] as const),
) {
  @ApiProperty({
    name: 'id',
    description: 'Chapter id (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsDefined()
  @Expose()
  @IsMongoId({
    message: 'id invalid',
  })
  id: string;
}
