import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Chapter } from './chapter';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  slug: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Chapter.name }],
  })
  chapters: Chapter[] = [];

  createdAt: Date;
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book)
  .set('timestamps', true)
  .set('selectPopulatedPaths', false);
