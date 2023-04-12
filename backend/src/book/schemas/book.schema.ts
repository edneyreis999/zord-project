import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Chapter } from '../../chapter/schemas/chapter.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    index: true,
    maxlength: 50,
  })
  name: string;

  @Prop({
    required: true,
  })
  slug: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Chapter.name }],
  })
  chapters: Chapter[];

  createdAt: Date;
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book)
  .set('timestamps', true)
  .set('selectPopulatedPaths', false);
