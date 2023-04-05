import { SceneModel } from './scene';

export class ArcModel {
  constructor(name: string) {
    this.name = name;
  }

  name: string;
  content: string;
  scenes: SceneModel[] = [];
  path: string;
}
