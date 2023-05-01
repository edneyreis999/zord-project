import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  NotFoundException,
  ParseFilePipeBuilder,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Book } from '../book/schemas/book.schema';
import {
  CrudDelete,
  CrudGetAll,
  CrudGetOne,
  CrudPatch,
  CrudPost,
  CrudPut,
} from '../request/crud.decorator';
import { FetchBookByIdPipe } from '../shared/pipes/fetch.book.by.id.pipe';
import { FileToStringPipe } from '../shared/pipes/file.to.context.pipe';
import { ValidateChapterCreationPipe } from '../shared/pipes/validate.chapter.creation.pipe';
import { ValidateChapterUpdatePipe } from '../shared/pipes/validate.chapter.update.pipe';
import { ChapterService } from './chapter.service';
import { createChapterFromDto, updateChapterFromDto } from './chapter.utils';
import { CreateChapterDto, CreateChapterWithFileDto } from './dto/create.dto';
import { PatchChapterDto, UpdateChapterDto } from './dto/patch.dto';
import { QueryManyChapterDto, QueryOneChapterDto } from './dto/query.dto';
import { ResponseChapterDto } from './dto/response.dto';

@Controller('chapter')
@ApiTags('chapter')
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async createByFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'text/plain',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          exceptionFactory(error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
          },
        }),
      FileToStringPipe,
    )
    fileContent: string,
    @Body('bookId', FetchBookByIdPipe) book: Book,
    @Body(ValidateChapterCreationPipe) dto: CreateChapterWithFileDto,
  ): Promise<ResponseChapterDto> {
    const chapterInput = createChapterFromDto(
      { ...dto, content: fileContent },
      book,
    );
    const chapter = await this.chapterService.create(chapterInput);

    return ResponseChapterDto.fromChapter(chapter);
  }

  @CrudPost('', {
    input: CreateChapterDto,
    output: ResponseChapterDto,
  })
  @ApiConsumes('application/json')
  @ApiOperation({
    summary: 'Create a chapter with a text.',
    description:
      'This endpoint allows you to create a new chapter by providing its text content.',
  })
  async createByText(
    @Body(ValidateChapterCreationPipe) dto: CreateChapterDto,
    @Body('bookId', FetchBookByIdPipe) book: Book,
  ): Promise<ResponseChapterDto> {
    const chapterInput = createChapterFromDto(dto, book);
    const chapter = await this.chapterService.create(chapterInput);

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
  async findById(
    @Query() query: QueryOneChapterDto,
  ): Promise<ResponseChapterDto> {
    const { filter, include } = query;
    const { id } = filter;
    const chapter = await this.chapterService.findById(id, include);
    if (!chapter) {
      throw new NotFoundException(`Chapter with id ${id} not found`);
    }
    return ResponseChapterDto.fromChapter(chapter);
  }

  @CrudPut('', {
    input: UpdateChapterDto,
    output: ResponseChapterDto,
  })
  async update(
    @Body(ValidateChapterUpdatePipe) dto: UpdateChapterDto,
  ): Promise<ResponseChapterDto> {
    const chapterInput = updateChapterFromDto(dto);
    const response = await this.chapterService.update(chapterInput);

    return ResponseChapterDto.fromChapter(response);
  }

  @CrudPatch('', {
    input: PatchChapterDto,
    output: ResponseChapterDto,
  })
  async patch(
    @Body(ValidateChapterUpdatePipe) dto: PatchChapterDto,
  ): Promise<ResponseChapterDto> {
    const chapterInput = updateChapterFromDto(dto);
    const response = await this.chapterService.update(chapterInput);

    return ResponseChapterDto.fromChapter(response);
  }

  @CrudDelete('')
  async remove(
    @Query() query: QueryOneChapterDto,
  ): Promise<ResponseChapterDto> {
    const { id } = query.filter;
    const deleted = await this.chapterService.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Chapter with id ${id} not found`);
    }

    return ResponseChapterDto.fromChapter(deleted);
  }
}
