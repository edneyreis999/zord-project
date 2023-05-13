import { Chapter } from '../../chapter/schemas/chapter.schema';
import { Scene } from '../../scene/schemas/scene.schema';

export interface IArc {
  id?: string;
  title: string;
  slug?: string;
  chapter?: Chapter;
  scenes?: Scene[];
  summary: string;
  content: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
