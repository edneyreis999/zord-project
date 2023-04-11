import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create.dto';
import { ResponseChapterDto } from './dto/response.dto';
import { CrudPost } from '../request/crud.decorator';

@Controller('chapter')
@ApiTags('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @CrudPost('/:bookId/chapter/file', {
    input: CreateChapterDto,
    output: ResponseChapterDto,
  })
  @ApiParam({ name: 'bookId', type: String })
  @ApiOperation({ summary: 'Importar arquivo de capítulo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: `O arquivo de texto a ser carregado`,
    type: CreateChapterDto,
  })
  async createChapter(
    @Body() createChapterDto: CreateChapterDto,
    @Param('bookId') bookId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseChapterDto> {
    this.validateFile(file);

    const { name } = createChapterDto;

    const chapter = await this.chapterService.createChapterFromTextFile(
      name,
      bookId,
      file,
    );

    return {
      name: chapter.name,
      arcs: chapter.arcs.map((arc) => arc.name),
    };
  }

  private validateFile(file: Express.Multer.File): void {
    if (file.originalname.split('.').pop() !== 'txt') {
      throw new HttpException(
        'Invalid file type. Use .txt files',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
