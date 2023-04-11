import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from '../schemas/chapter';
import { Model } from 'mongoose';
import { Arc } from '../schemas/arc';
import { Scene } from '../schemas/scene';
import { TextFileService } from './text-file.service';
import { BookService } from '../book/book.service';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Arc.name) private arcModel: Model<Arc>,
    @InjectModel(Scene.name) private sceneModel: Model<Scene>,
    private readonly textFileService: TextFileService,
    private readonly bookService: BookService,
  ) {}

  /**
   * Creates a new chapter with the given name and optional content.
   *
   * @param name - The name of the chapter.
   * @param content - The optional content of the chapter.
   * @returns - A Promise that resolves to the created Chapter object.
   */
  async createChapter(
    name: string,
    bookId: string,
    content?: string,
  ): Promise<Chapter> {
    if (!bookId) {
      throw new Error('A bookId must be provided to create a chapter.');
    }

    const book = await this.bookService.findOne(bookId);

    if (!book) {
      throw new Error(`Book with id '${bookId}' not found.`);
    }

    const chapter = await this.chapterModel.create({
      name,
      content,
      book: bookId,
    });

    // Add the chapter to the book
    book.chapters.push(chapter);
    await this.bookService.update(bookId, book);

    return chapter?.toObject();
  }

  /**
   * Creates a new arc with the given name and optional content.
   *
   * @param name - The name of the arc.
   * @param content - The optional content of the arc.
   * @returns - A Promise that resolves to the created Arc object.
   */
  async createArc(name: string, content?: string): Promise<Arc> {
    const arc = await this.arcModel.create({ name, content });
    return arc?.toObject();
  }

  /**
   * Creates a new scene with the given name and optional content.
   *
   * @param name - The optional name of the scene.
   * @param content - The optional content of the scene.
   * @returns - A Promise that resolves to the created Scene object.
   */
  async createScene(name?: string, content?: string): Promise<Scene> {
    const scene = await this.sceneModel.create({ name, content });
    return scene?.toObject();
  }

  /**
   * Creates a new chapter from a given text file, extracting arcs and scenes.
   *
   * @param name - The name of the chapter.
   * @param file - The text file containing the chapter content.
   * @returns - A Promise that resolves to the created Chapter object.
   */
  async createChapterFromTextFile(
    name: string,
    bookId: string,
    file: Express.Multer.File,
  ): Promise<Chapter> {
    const chapterText = await this.textFileService.readFile(file);
    const chapter = await this.createChapter(name, bookId, chapterText);

    // Extract arcs and scenes from the text file
    await this.processArcsAndScenes(chapter, chapterText);

    return chapter;
  }

  /**
   * Processes arcs and scenes for a given chapter.
   *
   * @param chapter - The Chapter object to add arcs and scenes to.
   * @param chapterText - The text content of the chapter.
   */
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
}
