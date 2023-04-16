import { Body, Controller, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
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
import { QueryManyBookDto, QueryOneBookDto } from './dto/query.dto';
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

  @CrudGetOne('/:id', ResponseBookDto)
  @ApiParam({ name: 'id', type: String })
  async findOne(
    @Param('id') id: string,
    @Query() query?: QueryOneBookDto,
  ): Promise<ResponseBookDto> {
    query = query || {};
    query.filter = {
      id,
    };
    const book = await this.bookService.findOne(query);
    return ResponseBookDto.fromBook(book);
  }

  @CrudPut('/:id', {
    input: CreateBookDto,
    output: ResponseBookDto,
  })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() dto: CreateBookDto,
  ): Promise<ResponseBookDto> {
    const response = await this.bookService.update(id, dto);

    return ResponseBookDto.fromBook(response);
  }

  @CrudPatch('/:id', {
    input: PatchBookDto,
    output: ResponseBookDto,
  })
  @ApiParam({ name: 'id', type: String })
  async patch(
    @Param('id') id: string,
    @Body() dto: PatchBookDto,
  ): Promise<ResponseBookDto> {
    const response = await this.bookService.update(id, dto);

    return ResponseBookDto.fromBook(response);
  }

  @CrudDelete('/:id')
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string): Promise<ResponseBookDto> {
    const deleted = await this.bookService.delete(id);

    return ResponseBookDto.fromBook(deleted);
  }
}
