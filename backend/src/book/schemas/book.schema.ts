import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StoryElement } from '../../interfaces/story.element';
import { Chapter } from '../../chapter/schemas/chapter.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book implements StoryElement {
  _id: mongoose.Schema.Types.ObjectId;

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

  @Prop([
    {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
    { default: [] },
  ])
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
