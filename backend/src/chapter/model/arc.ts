import { Scene } from './scene';

export class Arc {
  constructor(name: string) {
    this.name = name;
  }

  name: string;
  content: string;
  scenes: Scene[] = [];
  path: string;
}
