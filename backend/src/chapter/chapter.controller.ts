import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Query,
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
import {
  CrudDelete,
  CrudGetAll,
  CrudGetOne,
  CrudPatch,
  CrudPost,
  CrudPut,
} from '../request/crud.decorator';
import { PatchChapterDto } from './dto/patch.dto';
import { QueryManyChapterDto, QueryOneChapterDto } from './dto/query.dto';

@Controller('chapter')
@ApiTags('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @CrudPost('/:bookId/file', {
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
  async createChapterByFile(
    @Param('bookId') bookId: string,
    @Body() createChapterDto: CreateChapterDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseChapterDto> {
    this.validateFile(file);

    const { title } = createChapterDto;

    const chapter = await this.chapterService.create({
      title,
      bookId,
      file,
    });

    return ResponseChapterDto.fromChapter(chapter);
  }

  @CrudPost('', {
    input: CreateChapterDto,
    output: ResponseChapterDto,
  })
  async create(
    @Body() createChapterDto: CreateChapterDto,
  ): Promise<ResponseChapterDto> {
    const chapter = await this.chapterService.create(createChapterDto);

    return ResponseChapterDto.fromChapter(chapter);
  }

  @CrudGetAll('/:bookId', ResponseChapterDto)
  @ApiParam({ name: 'bookId', type: String })
  async findAll(
    @Param('bookId') bookId: string,
    @Query() query?: QueryManyChapterDto,
  ): Promise<ResponseChapterDto[]> {
    query = query || {};
    query.filter = {
      ...query.filter,
      bookId,
    };
    const paginated = await this.chapterService.findAll(query);
    return ResponseChapterDto.fromManyChapters(paginated);
  }

  @CrudGetOne('/id', ResponseChapterDto)
  async findOne(
    @Query() query?: QueryOneChapterDto,
  ): Promise<ResponseChapterDto> {
    const chapter = await this.chapterService.findOne(query);
    return ResponseChapterDto.fromChapter(chapter);
  }

  @CrudPut('/:id', {
    input: CreateChapterDto,
    output: ResponseChapterDto,
  })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() dto: CreateChapterDto,
  ): Promise<ResponseChapterDto> {
    const response = await this.chapterService.update(id, dto);

    return ResponseChapterDto.fromChapter(response);
  }

  @CrudPatch('/:id', {
    input: PatchChapterDto,
    output: ResponseChapterDto,
  })
  @ApiParam({ name: 'id', type: String })
  async patch(
    @Param('id') id: string,
    @Body() dto: PatchChapterDto,
  ): Promise<ResponseChapterDto> {
    const response = await this.chapterService.update(id, dto);

    return ResponseChapterDto.fromChapter(response);
  }

  @CrudDelete('/:id')
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string): Promise<ResponseChapterDto> {
    const deleted = await this.chapterService.delete(id);

    return ResponseChapterDto.fromChapter(deleted);
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
