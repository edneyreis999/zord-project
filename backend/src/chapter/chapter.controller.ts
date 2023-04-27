import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChapterService } from './chapter.service';
import {
  CreateChapterDto,
  CreateChapterWithFileDto,
  CreateChapterWithTextDto,
} from './dto/create.dto';
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
import {
  ChapterBasicFilterDto,
  QueryManyChapterDto,
  QueryOneChapterDto,
} from './dto/query.dto';

@Controller('chapter')
@ApiTags('Chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @CrudPost('/file', {
    input: CreateChapterWithFileDto,
    output: ResponseChapterDto,
  })
  @ApiOperation({
    summary: 'Create a chapter with a chapter file.',
    description:
      'This endpoint allows you to create a new chapter by providing its text file.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createByFile(
    @Body() createChapterDto: CreateChapterWithFileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'txt',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          exceptionFactory(error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
          },
        }),
    )
    file: Express.Multer.File,
  ): Promise<ResponseChapterDto> {
    createChapterDto.file = file;

    const chapter = await this.chapterService.createWithFile(createChapterDto);

    return ResponseChapterDto.fromChapter(chapter);
  }

  @CrudPost('', {
    input: CreateChapterWithTextDto,
    output: ResponseChapterDto,
  })
  @ApiConsumes('application/json')
  @ApiOperation({
    summary: 'Create a chapter with a text.',
    description:
      'This endpoint allows you to create a new chapter by providing its text content.',
  })
  async createByText(
    @Body() createChapterDto: CreateChapterWithTextDto,
  ): Promise<ResponseChapterDto> {
    const chapter = await this.chapterService.createWithText(createChapterDto);

    return ResponseChapterDto.fromChapter(chapter);
  }

  @CrudGetAll('', ResponseChapterDto)
  async findAll(
    @Query() query?: QueryManyChapterDto,
  ): Promise<ResponseChapterDto[]> {
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

  @CrudPut('', {
    input: CreateChapterDto,
    output: ResponseChapterDto,
  })
  async update(
    @Query() query: ChapterBasicFilterDto,
    @Body() dto: CreateChapterDto,
  ): Promise<ResponseChapterDto> {
    const response = await this.chapterService.update(query, dto);

    return ResponseChapterDto.fromChapter(response);
  }

  @CrudPatch('', {
    input: PatchChapterDto,
    output: ResponseChapterDto,
  })
  async patch(
    @Query() query: ChapterBasicFilterDto,
    @Body() dto: PatchChapterDto,
  ): Promise<ResponseChapterDto> {
    const response = await this.chapterService.update(query, dto);

    return ResponseChapterDto.fromChapter(response);
  }

  @CrudDelete('')
  async remove(
    @Query() query?: ChapterBasicFilterDto,
  ): Promise<ResponseChapterDto> {
    const deleted = await this.chapterService.delete(query);

    return ResponseChapterDto.fromChapter(deleted);
  }
}
