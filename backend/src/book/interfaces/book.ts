export interface IBook {
  id?: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
