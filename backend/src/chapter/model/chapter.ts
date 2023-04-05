import { ArcModel } from './arc';

export class ChapterModel {
  constructor(name: string) {
    this.name = name;
  }
  name: string;
  content: string;
  arcs: ArcModel[] = [];
}
