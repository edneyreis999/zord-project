import { Body, Controller, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CrudDelete,
  CrudGetAll,
  CrudGetOne,
  CrudPatch,
  CrudPost,
  CrudPut,
} from '../request/crud.decorator';
import { CreateBookDto } from './dto/create.dto';
import { ResponseBookDto } from './dto/response.dto';
import { BookService } from './book.service';
import {
  BookBasicFilterDto,
  QueryManyBookDto,
  QueryOneBookDto,
} from './dto/query.dto';
import { PatchBookDto } from './dto/patch.dto';

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
    const book = await this.bookService.findOne(query);
    return ResponseBookDto.fromBook(book);
  }

  @CrudPut('', {
    input: CreateBookDto,
    output: ResponseBookDto,
  })
  async update(
    @Query() query: BookBasicFilterDto,
    @Body() dto: CreateBookDto,
  ): Promise<ResponseBookDto> {
    const response = await this.bookService.update(query, dto);

    return ResponseBookDto.fromBook(response);
  }

  @CrudPatch('', {
    input: PatchBookDto,
    output: ResponseBookDto,
  })
  async patch(
    @Query() query: BookBasicFilterDto,
    @Body() dto: PatchBookDto,
  ): Promise<ResponseBookDto> {
    const response = await this.bookService.update(query, dto);

    return ResponseBookDto.fromBook(response);
  }

  @CrudDelete('')
  async remove(@Query() query: BookBasicFilterDto): Promise<ResponseBookDto> {
    const deleted = await this.bookService.delete(query);

    return ResponseBookDto.fromBook(deleted);
  }
}
