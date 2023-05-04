import { Body, Controller, NotFoundException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CrudDelete,
  CrudGetAll,
  CrudGetOne,
  CrudPatch,
  CrudPost,
  CrudPut,
} from '../request/crud.decorator';
import { ValidateBookUpdatePipe } from '../shared/pipes/validate.book.update.pipe';
import { BookService } from './book.service';
import { updateBookFromDto } from './book.utils';
import { CreateBookDto } from './dto/create.dto';
import { PatchBookDto, UpdateBookDto } from './dto/patch.dto';
import { QueryManyBookDto, QueryOneBookDto } from './dto/query.dto';
import { ResponseBookDto } from './dto/response.dto';

@Controller('book')
@ApiTags('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @CrudPost('', {
    input: CreateBookDto,
    output: ResponseBookDto,
  })
  async create(@Body() createBookDto: CreateBookDto): Promise<ResponseBookDto> {
    const book = await this.bookService.create(createBookDto);

    return ResponseBookDto.fromBook(book);
  }

  @CrudGetAll('', ResponseBookDto)
  async findAll(@Query() query: QueryManyBookDto): Promise<ResponseBookDto[]> {
    const paginated = await this.bookService.findAll(query);
    return ResponseBookDto.fromManyBooks(paginated);
  }

  @CrudGetOne('/id', ResponseBookDto)
  async findOne(@Query() query?: QueryOneBookDto): Promise<ResponseBookDto> {
    const { filter, include } = query;
    const { id } = filter;
    const chapter = await this.bookService.findById(id, include);
    if (!chapter) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return ResponseBookDto.fromBook(chapter);
  }

  @CrudPut('', {
    input: UpdateBookDto,
    output: ResponseBookDto,
  })
  async update(
    @Body(ValidateBookUpdatePipe) dto: UpdateBookDto,
  ): Promise<ResponseBookDto> {
    const bookInput = updateBookFromDto(dto);
    const response = await this.bookService.update(bookInput);

    return ResponseBookDto.fromBook(response);
  }

  @CrudPatch('', {
    input: PatchBookDto,
    output: ResponseBookDto,
  })
  async patch(
    @Body(ValidateBookUpdatePipe) dto: PatchBookDto,
  ): Promise<ResponseBookDto> {
    const bookInput = updateBookFromDto(dto);
    const response = await this.bookService.update(bookInput);

    return ResponseBookDto.fromBook(response);
  }

  @CrudDelete('')
  async remove(@Query() query: QueryOneBookDto): Promise<ResponseBookDto> {
    const { id } = query.filter;
    const deleted = await this.bookService.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return ResponseBookDto.fromBook(deleted);
  }
}
