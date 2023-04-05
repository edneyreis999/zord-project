import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateChapterDto } from './dto/create.dto';
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
  ) {
    if (!fs.existsSync(this.FOLDER_PATH)) {
      fs.mkdirSync(this.FOLDER_PATH);
    }
  }

  private readonly FOLDER_PATH = path.join(__dirname, '..', 'files-uploaded');

  async createChapterModel(name: string, content?: string): Promise<Chapter> {
    const chapter = (
      await this.chapterModel.create({ name, content })
    ).toObject();

    return chapter;
  }

  async createArcModel(name: string, content?: string) {
    const arc = (await this.arcModel.create({ name, content })).toObject();
    return arc;
  }
  async createSceneModel(name?: string, content?: string) {
    const scene = (await this.sceneModel.create({ name, content })).toObject();
    return scene;
  }

  async createChapter(dto: CreateChapterDto, file: Express.Multer.File) {
    const { name } = dto;
    const arcs = await this.extractArcsFromChapterFile(file);
    return {
      name,
      numberOfArcs: arcs.length,
    };
  }

  private async extractArcsFromChapterFile(file: Express.Multer.File) {
    const filePath = path.join(this.FOLDER_PATH, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const fileContent = fs.readFileSync(filePath).toString();
    const regexArc = /<arc>([\s\S]*?)<\/arc>/g;

    let match;
    let countArc = 1;
    const arcs: string[] = [];

    while ((match = regexArc.exec(fileContent))) {
      const arcFilePath = path.join(this.FOLDER_PATH, `arc-${countArc}.txt`);
      fs.writeFileSync(arcFilePath, match[1]);
      arcs.push(match[1]);

      await this.extractScenesFromArc(match[1], countArc);

      countArc++;
    }

    return arcs;
  }

  private async extractScenesFromArc(arcContent: string, countArc: number) {
    const regexScene = /<scene>([\s\S]*?)<\/scene>/g;

    let sceneMatch;
    let countScene = 1;

    while ((sceneMatch = regexScene.exec(arcContent))) {
      const sceneFilePath = path.join(
        this.FOLDER_PATH,
        `arc-${countArc}-scene-${countScene}.txt`,
      );
      fs.writeFileSync(sceneFilePath, sceneMatch[1]);
      countScene++;
    }
  }
}
