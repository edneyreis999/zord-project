import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Chapter } from '../../chapter/schemas/chapter.schema';
import { StoryElement } from '../../interfaces/story.element';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book implements StoryElement {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    index: true,
    maxlength: 50,
  })
  title: string;

  @Prop({
    required: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  })
  slug: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Chapter.name }],
  })
  chapters: Chapter[];

  @Prop()
  summary: string;

  @Prop()
  content: string;

  @Prop({
    type: Number,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer',
    },
  })
  order: number;

  createdAt: Date;

  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book).set(
  'selectPopulatedPaths',
  false,
);
