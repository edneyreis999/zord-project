import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create.dto';

export class PatchBookDto extends PartialType(CreateBookDto) {}
