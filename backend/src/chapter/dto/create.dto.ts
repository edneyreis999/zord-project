import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateStoryElementDto } from '../../shared/story-element/story.element.create.dto';
import { Book } from '../../book/schemas/book.schema';

export class CreateChapterDto extends CreateStoryElementDto {}

export class CreateChapterWithFileDto extends OmitType(CreateStoryElementDto, [
  'content',
] as const) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Text file to upload',
  })
  file?: Express.Multer.File;
}

export class CreateChapterWithTextDto extends CreateStoryElementDto {
  book?: Book;
}
