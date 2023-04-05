import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create.dto';
import { ResponseChapterDto } from './dto/response.dto';
import { CrudPost } from 'src/request/crud.decorator';
import { TextFileService } from './text-file.service';

@Controller('book')
@ApiTags('book')
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly textFileService: TextFileService,
  ) {}

  @CrudPost('chapter', {
    input: CreateChapterDto,
    output: ResponseChapterDto,
  })
  @ApiOperation({ summary: 'Importar arquivo de capítulo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: `O arquivo de texto a ser carregado`,
    type: CreateChapterDto,
  })
  async createChapter(
    @Body() createChapterDto: CreateChapterDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseChapterDto> {
    // Validate the DTO
    // const errors = await createChapterDto.validate();
    // if (errors.length > 0) {
    //   throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    // }

    // Validate the file
    if (file.originalname.split('.').pop() !== 'txt') {
      throw new HttpException(
        'Tipo de arquivo inválido. Use arquivos .txt',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { name } = createChapterDto;

    const chapterText = await this.textFileService.readFile(file);

    const chapter = await this.chapterService.createChapterModel(
      name,
      chapterText,
    );

    // Extract the arcs and scenes from the text file
    const arcsText = await this.textFileService.extractArcs(chapterText);
    let contArcs = 1;
    for (const arcText of arcsText) {
      const arc = await this.chapterService.createArcModel(
        `arc-${contArcs}`,
        arcText,
      );
      const scenesText = await this.textFileService.extractScenes(
        arc.name,
        arc.content,
      );

      for (const sceneText of scenesText) {
        const scene = await this.chapterService.createSceneModel('', sceneText);
        arc.scenes.push(scene);
      }

      chapter.arcs.push(arc);
      contArcs++;
    }

    return {
      name: chapter.name,
      arcs: chapter.arcs.map((arc) => arc.name),
    };
  }
}
