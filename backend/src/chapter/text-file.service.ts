import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class TextFileService {
  private readonly FOLDER_PATH = path.join(__dirname, '..', 'files-uploaded');

  async readFile(file: Express.Multer.File) {
    return file.buffer.toString();
  }

  async extractArcs(chapterText: string) {
    const regexArc = /<arc>([\s\S]*?)<\/arc>/g;

    let match;
    const arcs: string[] = [];

    while ((match = regexArc.exec(chapterText))) {
      arcs.push(match[1]);
    }

    return arcs;
  }

  async extractScenes(arcText: string) {
    const regexScene = /<scene>([\s\S]*?)<\/scene>/g;

    let match;
    const scenes: string[] = [];

    while ((match = regexScene.exec(arcText))) {
      scenes.push(match[1]);
    }

    return scenes;
  }
}
