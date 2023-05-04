import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { CreateStoryElementDto } from '../../shared/story-element/story.element.create.dto';

export class CreateChapterDto extends CreateStoryElementDto {
  @ApiProperty({
    type: String,
    name: 'bookId',
    description: 'Book id (Example: 5f9f1c9b9c9c1c0c8c8c8c8c)',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsMongoId({
    message: 'book id invalid',
  })
  bookId: string;
}

export class CreateChapterWithFileDto extends OmitType(CreateChapterDto, [
  'content',
] as const) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Text file to upload',
  })
  file?: Express.Multer.File;
}
