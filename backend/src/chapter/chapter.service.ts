import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BookService } from '../book/book.service';
import { Arc } from '../schemas/arc';
import { Scene } from '../schemas/scene';
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
    @InjectModel(Scene.name) private sceneModel: Model<Scene>,
    private readonly textFileService: TextFileService,
    private readonly bookService: BookService,
  ) {
    super(chapterModel);
  }

  async create(chapter: IChapter): Promise<Chapter> {
    const { book } = chapter;

    const arcs = await this.processArcsAndScenes(chapter.content);

    const createdChapter = await super.create({
      ...chapter,
      arcs,
    });

    book.chapters.push(createdChapter);
    const updatedBook = await this.bookService.update(book);

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
    const book = await this.bookService.findById(
      chapterDeleted.book._id.toString(),
    );
    book.chapters = book.chapters.filter(
      (chapter) => chapter._id.toString() !== id,
    );
    await this.bookService.update(book);

    return chapterDeleted;
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
}
