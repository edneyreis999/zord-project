import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TextFileService {
  private readonly FOLDER_PATH = path.join(__dirname, '..', 'files-uploaded');

  async readFile(file: Express.Multer.File) {
    const filePath = path.join(this.FOLDER_PATH, file.originalname);
    if (!fs.existsSync(this.FOLDER_PATH)) {
      fs.mkdirSync(this.FOLDER_PATH);
    }
    fs.writeFileSync(filePath, file.buffer);

    const fileContent = fs.readFileSync(filePath).toString();
    return fileContent;
  }

  async extractArcs(chapterText: string) {
    const regexArc = /<arc>([\s\S]*?)<\/arc>/g;

    let match;
    let countArc = 1;
    const arcs: string[] = [];

    while ((match = regexArc.exec(chapterText))) {
      const arcFileFolderPath = path.join(
        `${this.FOLDER_PATH}`,
        `arc-${countArc}`,
      );
      const arcFilePath = path.join(arcFileFolderPath, `arc.txt`);
      if (!fs.existsSync(arcFileFolderPath)) {
        fs.mkdirSync(arcFileFolderPath);
      }
      fs.writeFileSync(arcFilePath, match[1]);
      arcs.push(match[1]);

      countArc++;
    }

    return arcs;
  }

  async extractScenes(arcName: string, arcText: string) {
    const regexScene = /<scene>([\s\S]*?)<\/scene>/g;

    let match;
    let countScene = 1;
    const scenes: string[] = [];

    while ((match = regexScene.exec(arcText))) {
      const arcFileFolderPath = path.join(`${this.FOLDER_PATH}`, arcName);
      const sceneFilePath = path.join(
        arcFileFolderPath,
        `scene-${countScene}.txt`,
      );
      if (!fs.existsSync(arcFileFolderPath)) {
        fs.mkdirSync(arcFileFolderPath);
      }
      fs.writeFileSync(sceneFilePath, match[1]);
      scenes.push(match[1]);

      countScene++;
    }

    return scenes;
  }
}
