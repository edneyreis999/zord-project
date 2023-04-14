import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from './schemas/chapter.schema';
import { Model } from 'mongoose';
import { Arc } from '../schemas/arc';
import { Scene } from '../schemas/scene';
import { TextFileService } from './text-file.service';
import { BookService } from '../book/book.service';
import { CreateChapterDto } from './dto/create.dto';
import { StoryElementCrudService } from '../shared/story.element.crud.service';

@Injectable()
export class ChapterService extends StoryElementCrudService<Chapter> {
  protected availableFieldsToInclude = ['arcs'];

  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Arc.name) private arcModel: Model<Arc>,
    @InjectModel(Scene.name) private sceneModel: Model<Scene>,
    private readonly textFileService: TextFileService,
    private readonly bookService: BookService,
  ) {
    super(chapterModel);
  }

  async create(
    defaultData: Partial<Chapter> & CreateChapterDto,
  ): Promise<Chapter> {
    const { bookId, file } = defaultData;
    if (!bookId) {
      throw new Error('A bookId must be provided to create a chapter.');
    }

    const book = await this.bookService.findOne(bookId);

    if (!book) {
      throw new Error(`Book with id '${bookId}' not found.`);
    }

    const chapter = await super.create({ ...defaultData });

    // Add the chapter to the book
    book.chapters.push(chapter);
    await this.bookService.update(bookId, book);

    if (file) {
      const chapterText = await this.textFileService.readFile(file);
      // Extract arcs and scenes from the text file
      await this.processArcsAndScenes(chapter, chapterText);
    }

    return chapter;
  }

  private async processArcsAndScenes(
    chapter: Chapter,
    chapterText: string,
  ): Promise<void> {
    const arcsText = await this.textFileService.extractArcs(chapterText);

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

      chapter.arcs.push(arc);
    }
  }

  private async createArc(name: string, content?: string): Promise<Arc> {
    const arc = await this.arcModel.create({ name, content });
    return arc?.toObject();
  }

  private async createScene(name?: string, content?: string): Promise<Scene> {
    const scene = await this.sceneModel.create({ name, content });
    return scene?.toObject();
  }
}
