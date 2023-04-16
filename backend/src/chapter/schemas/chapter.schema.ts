import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Arc } from '../../schemas/arc';
import { StoryElement } from '../../interfaces/story.element';
import { Book } from '../../book/schemas/book.schema';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true, autoIndex: true })
export class Chapter implements StoryElement {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: Book.name,
  })
  book: Book | mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  })
  slug: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Arc.name }],
  })
  arcs: Arc[];

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

export const ChapterSchema = SchemaFactory.createForClass(Chapter).set(
  'selectPopulatedPaths',
  false,
);

ChapterSchema.index({ order: 1, book: 1 }, { unique: true });
ChapterSchema.index({ title: 1, book: 1 }, { unique: true });
ChapterSchema.index({ slug: 1, book: 1 }, { unique: true });
