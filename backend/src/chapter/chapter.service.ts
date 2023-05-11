import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ClsService } from 'nestjs-cls';
import { Arc } from '../arc/schemas/arc';
import { BookService } from '../book/book.service';
import { IZordContext } from '../interfaces/cls.store';
import { SceneService } from '../scene/scene.service';
import { Scene } from '../scene/schemas/scene.schema';
import { StoryElementCrudService } from '../shared/story-element/story.element.crud.service';
import { generateSlug } from '../shared/story-element/story.element.utils';
import { TextFileService } from '../text-file/text-file.service';
import { QueryManyChapterDto } from './dto/query.dto';
import { IChapter } from './interface/Chapter';
import { Chapter } from './schemas/chapter.schema';

@Injectable()
export class ChapterService extends StoryElementCrudService<Chapter> {
  protected availableFieldsToInclude = ['book', 'arcs'];

  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Arc.name) private arcModel: Model<Arc>,
    private readonly textFileService: TextFileService,
    private readonly bookService: BookService,
    private readonly sceneService: SceneService,
    private readonly cls: ClsService<IZordContext>,
  ) {
    super(chapterModel);
  }

  async create(chapter: IChapter): Promise<Chapter> {
    const { book } = chapter;

    const createdChapter = await super.create({
      ...chapter,
    });

    await this.processArcsAndScenes(createdChapter);

    const updatedBook = await this.bookService.addChapter(
      book._id.toString(),
      createdChapter,
    );

    // Just to make sure the created chapter is updated
    createdChapter.book = updatedBook;

    return createdChapter;
  }

  async update(chapter: IChapter): Promise<Chapter> {
    const { id, title } = chapter;

    if (title) {
      chapter.slug = generateSlug(title);
    }

    const chapterUpdated = await this.model.findOneAndUpdate(
      { _id: id },
      chapter,
      {
        new: true, // Return the updated document
        runValidators: true, // Run validations on the update
      },
    );

    return chapterUpdated;
  }

  async findAll(queryDto: QueryManyChapterDto): Promise<Chapter[]> {
    const { filter, include, page, sort } = queryDto;
    const { id, bookId, slug, title } = filter;

    const queryFilter: FilterQuery<Chapter> = {
      book: bookId,
    };

    if (id) {
      queryFilter._id = id;
      const chapterQuery = this.model.find(queryFilter);
      if (include) {
        super.populateWithIncludes(chapterQuery, include);
      }

      return chapterQuery.exec();
    }
    if (title) {
      queryFilter.title = new RegExp(title, 'i');
    }
    queryFilter.slug = new RegExp(slug, 'i');
    if (slug) {
    }

    const sortQuery = this.createSortQuery(sort);

    const { offset, limit } = page ?? {};

    const chapterQuery = this.model
      .find(queryFilter)
      .sort(sortQuery)
      .skip(offset)
      .limit(limit);

    if (include) {
      this.populateWithIncludes(chapterQuery, include);
    }

    return chapterQuery.exec();
  }

  async delete(id: string): Promise<Chapter> {
    const chapterDeleted = await super.delete(id);

    if (!chapterDeleted) {
      return null;
    }

    // Remove the chapter from the book
    await this.bookService.removeChapter(
      chapterDeleted.book._id.toString(),
      chapterDeleted,
    );

    return chapterDeleted;
  }

  /**
   * Find a chapter by its ID and optionally include related data.
   *
   * @param {string} id - The ID of the chapter to be fetched.
   * @param {string[]} [include=this.availableFieldsToInclude] - An array of related fields to include in the response (default is to include all available fields).
   * @returns {Promise<Book>} A promise that resolves to the found chapter with its related data included based on the `include` parameter.
   */
  async findById(id: string, include?: string[]): Promise<Chapter> {
    const chapter = await super.findById(id, include);
    // this.cls.set('chapter', chapter);
    return chapter;
  }

  private async processArcsAndScenes(chapter: Chapter): Promise<Arc[]> {
    const arcsText = await this.textFileService.extractArcs(chapter.content);
    const arcs: Arc[] = [];

    // Iterate over arcs, creating and adding them to the chapter
    for (const [index, arcText] of arcsText.entries()) {
      const arcName = `arc-${index + 1}`;
      const arc = await this.createArc(arcName, arcText);
      const scenesText = await this.textFileService.extractScenes(arc.content);

      // Iterate over scenes, creating and adding them to the arc
      for (const [sceneIndex, sceneText] of scenesText.entries()) {
        const sceneName = `${arcName}-scene-${sceneIndex + 1}`;
        const scene = await this.createScene({
          title: sceneName,
          content: sceneText,
          order: sceneIndex + 1,
          chapter: chapter,
        });
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

  private async createScene(sceneInput: {
    title: string;
    content: string;
    order: number;
    chapter: Chapter;
  }): Promise<Scene> {
    const { title, content, order, chapter } = sceneInput;
    const scene = await this.sceneService.create({
      title: title,
      content: content,
      order: order,
      summary: '',
      chapter: chapter,
    });
    return scene;
  }
}
