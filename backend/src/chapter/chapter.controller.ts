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
import { TextFileService } from './text-file.service';
import { CrudPost } from '../request/crud.decorator';

@Controller('book')
@ApiTags('book')
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly textFileService: TextFileService,
  ) {}

  @CrudPost('chapter/file', {
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
    this.validateCreateChapterDto(createChapterDto);
    this.validateFile(file);

    const { name } = createChapterDto;

    const chapterText = await this.textFileService.readFile(file);

    const chapter = await this.chapterService.createChapter(name, chapterText);

    // Extract the arcs and scenes from the text file
    const arcsText = await this.textFileService.extractArcs(chapterText);
    let contArcs = 1;
    for (const arcText of arcsText) {
      const arcName = `arc-${contArcs}`;
      const arc = await this.chapterService.createArc(arcName, arcText);
      const scenesText = await this.textFileService.extractScenes(arc.content);

      let contScenes = 1;
      for (const sceneText of scenesText) {
        const scene = await this.chapterService.createScene(
          `${arcName}-scene-${contScenes}`,
          sceneText,
        );
        arc.scenes.push(scene);
        contScenes++;
      }

      chapter.arcs.push(arc);
      contArcs++;
    }

    return {
      name: chapter.name,
      arcs: chapter.arcs.map((arc) => arc.name),
    };
  }

  private validateCreateChapterDto(createChapterDto: CreateChapterDto): void {
    // validate that required fields are present and have valid data types
    // throw an HttpException if validation fails
    console.log(createChapterDto);
  }

  private validateFile(file: Express.Multer.File): void {
    if (file.originalname.split('.').pop() !== 'txt') {
      throw new HttpException(
        'Invalid file type. Use .txt files',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
