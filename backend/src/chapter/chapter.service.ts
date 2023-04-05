import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateChapterDto } from './dto/create.dto';
import { Chapter } from './model/chapter';
import { Arc } from './model/arc';
import { Scene } from './model/scene';

@Injectable()
export class ChapterService {
  private readonly FOLDER_PATH = path.join(__dirname, '..', 'files-uploaded');

  constructor() {
    if (!fs.existsSync(this.FOLDER_PATH)) {
      fs.mkdirSync(this.FOLDER_PATH);
    }
  }

  async createChapterModel(name: string, content?: string) {
    const chapter = new Chapter(name);
    chapter.content = content;
    return chapter;
  }

  async createArcModel(name: string, content?: string) {
    const arc = new Arc(name);
    arc.content = content;
    return arc;
  }
  async createSceneModel(name?: string, content?: string) {
    const scene = new Scene(name);
    scene.content = content;
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
