import { Injectable } from '@nestjs/common';

@Injectable()
export class TextFileService {
  /**
   * Reads the content of a text file uploaded using Express Multer.
   *
   * @param file - The text file uploaded as an Express.Multer.File object.
   * @returns - A Promise that resolves to the content of the file as a string.
   */
  async readFile(file: Express.Multer.File): Promise<string> {
    return file.buffer.toString();
  }

  /**
   * Extracts arcs from the given chapter text.
   *
   * @param chapterText - The text content of the chapter.
   * @returns - A Promise that resolves to an array of extracted arc texts.
   */
  async extractArcs(chapterText: string): Promise<string[]> {
    const regexArc = /<arc>([\s\S]*?)<\/arc>/g;
    const arcs: string[] = [];

    let match: RegExpExecArray;
    while ((match = regexArc.exec(chapterText))) {
      arcs.push(match[1]);
    }

    return arcs;
  }

  /**
   * Extracts scenes from the given arc text.
   *
   * @param arcText - The text content of the arc.
   * @returns - A Promise that resolves to an array of extracted scene texts.
   */
  async extractScenes(arcText: string): Promise<string[]> {
    const regexScene = /<scene>([\s\S]*?)<\/scene>/g;
    const scenes: string[] = [];

    let match: RegExpExecArray;
    while ((match = regexScene.exec(arcText))) {
      scenes.push(match[1]);
    }

    return scenes;
  }
}
