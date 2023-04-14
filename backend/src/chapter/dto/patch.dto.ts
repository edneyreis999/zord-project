import { PartialType } from '@nestjs/swagger';
import { CreateChapterDto } from './create.dto';

export class PatchChapterDto extends PartialType(CreateChapterDto) {}
