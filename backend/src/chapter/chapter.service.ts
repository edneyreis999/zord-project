import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from './schemas/chapter.schema';
import { Model } from 'mongoose';
import { Arc } from '../schemas/arc';
import { Scene } from '../schemas/scene';
import { TextFileService } from '../text-file/text-file.service';
import { BookService } from '../book/book.service';
import { CreateChapterDto, CreateChapterWithFileDto } from './dto/create.dto';
import { StoryElementCrudService } from '../shared/story-element/story.element.crud.service';
import { PatchChapterDto } from './dto/patch.dto';
import { QueryOneChapterDto } from './dto/query.dto';

@Injectable()
export class ChapterService extends StoryElementCrudService<Chapter> {
  protected availableFieldsToInclude = ['book', 'arcs'];

  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Arc.name) private arcModel: Model<Arc>,
    @InjectModel(Scene.name) private sceneModel: Model<Scene>,
    private readonly textFileService: TextFileService,
    private readonly bookService: BookService,
  ) {
    super(chapterModel);
  }

  async createWithFile(
    defaultData: Partial<Chapter> & CreateChapterWithFileDto,
  ): Promise<Chapter> {
    const { bookId, file } = defaultData;

    const book = await this.bookService.findOne({
      filter: { id: bookId },
      include: ['chapters'],
    });

    defaultData.content = await this.textFileService.readFile(file);
    // Extract arcs and scenes from the text file
    defaultData.arcs = await this.processArcsAndScenes(defaultData.content);

    const chapter = await super.create({ ...defaultData, book });

    const updatedBook = await this.bookService.update(
      { filter: { id: bookId } },
      {
        chapters: [...book.chapters, chapter] as Chapter[],
      },
    );

    // Just to make sure the book is updated
    chapter.book = updatedBook;

    return chapter;
  }

  async createWithText(
    defaultData: Partial<Chapter> & CreateChapterDto,
  ): Promise<Chapter> {
    const { bookId } = defaultData;

    const book = await this.bookService.findOne({
      filter: { id: bookId },
      include: ['chapters'],
    });

    // TODO: Mover essa validação para o DTO
    if (!book) {
      throw new BadRequestException(`Book with id '${bookId}' not found.`);
    }

    const chapter = await super.create({ ...defaultData, book });

    const updatedBook = await this.bookService.update(
      { filter: { id: bookId } },
      {
        chapters: [...book.chapters, chapter] as Chapter[],
      },
    );

    // Just to make sure the book is updated
    chapter.book = updatedBook;

    return chapter;
  }

  private async processArcsAndScenes(chapterText: string): Promise<Arc[]> {
    const arcsText = await this.textFileService.extractArcs(chapterText);
    const arcs: Arc[] = [];

    // Iterate over arcs, creating and adding them to the chapter
    for (const [index, arcText] of arcsText.entries()) {
      const arcName = `arc-${index + 1}`;
      const arc = await this.createArc(arcName, arcText);
      const scenesText = await this.textFileService.extractScenes(arc.content);

      // Iterate over scenes, creating and adding them to the arc
      for (const [sceneIndex, sceneText] of scenesText.entries()) {
        const sceneName = `${arcName}-scene-${sceneIndex + 1}`;
        const scene = await this.createScene(sceneName, sceneText);
        arc.scenes.push(scene);
      }

      arcs.push(arc);
    }

    return arcs;
  }

  private async createArc(name: string, content?: string): Promise<Arc> {
    const arc = await this.arcModel.create({ name, content });
    return arc?.toObject();
  }

  private async createScene(name?: string, content?: string): Promise<Scene> {
    const scene = await this.sceneModel.create({ name, content });
    return scene?.toObject();
  }

  async update(
    dto: QueryOneChapterDto,
    defaultData: CreateChapterDto | PatchChapterDto,
  ): Promise<Chapter> {
    const { filter } = dto;
    const { bookId, id } = filter;
    const book = await this.bookService.findOne({
      filter: { id: bookId },
      include: ['chapters'],
    });

    const chapterToUpdate = book.chapters.find(
      (chapter) => chapter._id.toString() === id,
    );

    // TODO: Colocar essa validação no decorator do DTO
    if (!chapterToUpdate) {
      throw new BadRequestException(
        `Chapter with id '${id}' not found in book '${bookId}'.`,
      );
    }

    return super.update(dto, defaultData);
  }
}
