import { Arc } from './arc';

export class Chapter {
  constructor(name: string) {
    this.name = name;
  }
  name: string;
  content: string;
  arcs: Arc[] = [];
}
