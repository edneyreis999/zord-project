import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from '../schemas/chapter';
import { Model } from 'mongoose';
import { Arc } from '../schemas/arc';
import { Scene } from '../schemas/scene';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Arc.name) private arcModel: Model<Arc>,
    @InjectModel(Scene.name) private sceneModel: Model<Scene>,
  ) {}

  async createChapter(name: string, content?: string): Promise<Chapter> {
    const chapter = (
      await this.chapterModel.create({ name, content })
    ).toObject();
    return chapter;
  }
  async createArc(name: string, content?: string) {
    const arc = (await this.arcModel.create({ name, content })).toObject();
    return arc;
  }
  async createScene(name?: string, content?: string) {
    const scene = (await this.sceneModel.create({ name, content })).toObject();
    return scene;
  }
}
