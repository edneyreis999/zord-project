import { Chapter } from '../../chapter/schemas/chapter.schema';

export interface IScene {
  id?: string;
  title: string;
  slug?: string;
  chapter?: Chapter;
  summary: string;
  content: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
