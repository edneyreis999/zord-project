import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from './schemas/chapter.schema';
import { Model } from 'mongoose';
import { Arc } from '../schemas/arc';
import { Scene } from '../schemas/scene';
import { TextFileService } from '../text-file/text-file.service';
import { BookService } from '../book/book.service';
import { CreateChapterDto } from './dto/create.dto';
import { StoryElementCrudService } from '../shared/story-element/story.element.crud.service';
import { PatchChapterDto } from './dto/patch.dto';

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
    const { bookId, file, order } = defaultData;
    if (!bookId) {
      throw new Error('A bookId must be provided to create a chapter.');
    }

    const book = await this.bookService.findOne({
      filter: { id: bookId },
      include: ['chapters'],
    });

    if (!book) {
      throw new Error(`Book with id '${bookId}' not found.`);
    }

    if (!order) {
      defaultData.order = book.chapters.length + 1;
    } else {
      // validate if there is already a chapter with the same order
      const chapterWithSameOrder = book.chapters.find(
        (chapter) => chapter.order === order,
      );
      if (chapterWithSameOrder) {
        throw new Error(
          `There is already a chapter with order '${order}' in book '${bookId}'.`,
        );
      }
    }

    if (!defaultData.title || defaultData.title === '') {
      throw new Error('Title cannot be undefined or an empty string.');
    } else {
      const chapterWithSameTitle = book.chapters.find(
        (chapter) => chapter.title === defaultData.title,
      );
      if (chapterWithSameTitle) {
        throw new Error(
          `There is already a chapter with title '${defaultData.title}' in book '${bookId}'.`,
        );
      }
    }

    if (file) {
      defaultData.content = await this.textFileService.readFile(file);
      // Extract arcs and scenes from the text file
      defaultData.arcs = await this.processArcsAndScenes(defaultData.content);
    }
    const chapter = await super.create({ ...defaultData, book });

    await this.bookService.update(bookId, {
      chapters: [...book.chapters, chapter] as Chapter[],
    });

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
    id: string,
    defaultData: CreateChapterDto | PatchChapterDto,
  ): Promise<Chapter> {
    const { bookId, order } = defaultData;
    const book = await this.bookService.findOne({
      filter: { id: bookId },
      include: ['chapters'],
    });

    if (!book) {
      throw new Error(`Book with id '${bookId}' not found.`);
    }

    const chapterToUpdate = book.chapters.find(
      (chapter) => chapter._id.toString() === id,
    );
    if (!chapterToUpdate) {
      throw new Error(`Chapter with id '${id}' not found in book '${bookId}'.`);
    }

    if (!order) {
      defaultData.order = book.chapters.length + 1;
    } else {
      // validate if there is already a chapter with the same order
      const chapterWithSameOrder = book.chapters.find(
        (chapter) => chapter.order === order,
      );
      if (chapterWithSameOrder) {
        throw new Error(
          `There is already a chapter with order '${order}' in book '${bookId}'.`,
        );
      }
    }

    if (defaultData.title) {
      const chapterWithSameTitle = book.chapters.find(
        (chapter) => chapter.title === defaultData.title,
      );
      if (chapterWithSameTitle) {
        throw new Error(
          `There is already a chapter with title '${defaultData.title}' in book '${bookId}'.`,
        );
      }
    }

    return super.update(id, defaultData);
  }
}
