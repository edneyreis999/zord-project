import { Controller, NotFoundException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudGetAll, CrudGetOne } from '../request/crud.decorator';
import { ArcService } from './arc.service';
import { QueryManyArcDto, QueryOneArcDto } from './dto/query-scene.dto';
import { ResponseArcDto } from './dto/response-scene.dto';

@Controller('arc')
@ApiTags('arc')
export class ArcController {
  constructor(private readonly arcService: ArcService) {}

  @CrudGetAll('', ResponseArcDto)
  async findAll(@Query() query?: QueryManyArcDto): Promise<ResponseArcDto[]> {
    const paginated = await this.arcService.findAll(query);
    return ResponseArcDto.fromManyArcs(paginated);
  }

  @CrudGetOne('/id', ResponseArcDto)
  async findOne(@Query() query: QueryOneArcDto): Promise<ResponseArcDto> {
    const { filter, include } = query;
    const { id } = filter;
    const arc = await this.arcService.findById(id, include);
    if (!arc) {
      throw new NotFoundException(`Arc with id ${id} not found`);
    }
    return ResponseArcDto.fromArc(arc);
  }
}
