import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { StoryElementCrudService } from '../shared/story-element/story.element.crud.service';
import { QueryManySceneDto } from './dto/query-scene.dto';
import { IScene } from './interface/Scene';
import { Scene } from './schemas/scene.schema';

@Injectable()
export class SceneService extends StoryElementCrudService<Scene> {
  protected availableFieldsToInclude = ['chapter'];

  constructor(@InjectModel(Scene.name) private sceneModel: Model<Scene>) {
    super(sceneModel);
  }

  async create(scene: IScene): Promise<Scene> {
    const createdScene = await super.create({
      ...scene,
    });

    return createdScene;
  }

  findAll(queryDto: QueryManySceneDto) {
    const { filter, include, page, sort } = queryDto;
    const { id, chapterId, slug, title } = filter;

    const queryFilter: FilterQuery<Scene> = {
      chapter: chapterId,
    };

    if (id) {
      queryFilter._id = id;
      const sceneQuery = this.model.find(queryFilter);
      if (include) {
        super.populateWithIncludes(sceneQuery, include);
      }

      return sceneQuery.exec();
    }
    if (title) {
      queryFilter.title = new RegExp(title, 'i');
    }
    queryFilter.slug = new RegExp(slug, 'i');
    if (slug) {
    }

    const sortQuery = this.createSortQuery(sort);

    const { offset, limit } = page ?? {};

    const sceneQuery = this.model
      .find(queryFilter)
      .sort(sortQuery)
      .skip(offset)
      .limit(limit);

    if (include) {
      this.populateWithIncludes(sceneQuery, include);
    }

    return sceneQuery.exec();
  }

  /**
   * Find a scene by its ID and optionally include related data.
   *
   * @param {string} id - The ID of the scene to be fetched.
   * @param {string[]} [include=this.availableFieldsToInclude] - An array of related fields to include in the response.
   * @returns {Promise<Book>} A promise that resolves to the found scene with its related data included based on the `include` parameter.
   */
  async findById(id: string, include?: string[]): Promise<Scene> {
    const scene = await super.findById(id, include);
    // this.cls.set('scene', scene);
    return scene;
  }
}
