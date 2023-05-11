import { Controller, NotFoundException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudGetAll, CrudGetOne } from '../request/crud.decorator';
import { QueryManySceneDto, QueryOneSceneDto } from './dto/query-scene.dto';
import { ResponseSceneDto } from './dto/response-scene.dto';
import { SceneService } from './scene.service';

@Controller('scene')
@ApiTags('scene')
export class SceneController {
  constructor(private readonly sceneService: SceneService) {}

  @CrudGetAll('', ResponseSceneDto)
  async findAll(
    @Query() query?: QueryManySceneDto,
  ): Promise<ResponseSceneDto[]> {
    const paginated = await this.sceneService.findAll(query);
    return ResponseSceneDto.fromManyScenes(paginated);
  }

  @CrudGetOne('/id', ResponseSceneDto)
  async findOne(@Query() query: QueryOneSceneDto): Promise<ResponseSceneDto> {
    const { filter, include } = query;
    const { id } = filter;
    const scene = await this.sceneService.findById(id, include);
    if (!scene) {
      throw new NotFoundException(`Scene with id ${id} not found`);
    }
    return ResponseSceneDto.fromScene(scene);
  }
}
