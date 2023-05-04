import { Injectable, PipeTransform } from '@nestjs/common';
import { PatchBookDto } from '../../book/dto/patch.dto';
import { FetchBookByIdPipe } from './fetch.book.by.id.pipe';

@Injectable()
export class ValidateBookUpdatePipe implements PipeTransform {
  constructor(private readonly fetchBookByIdPipe: FetchBookByIdPipe) {}

  async transform(dto: PatchBookDto) {
    await this.fetchBookByIdPipe.transform(dto.id);

    return dto;
  }
}
