import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Arc } from '../../arc/schemas/arc';
import { Book } from '../../book/schemas/book.schema';
import { IChapter } from '../interface/Chapter';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true, autoIndex: true })
export class Chapter implements IChapter {
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
  book: Book;

  @Prop({
    required: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  })
  slug: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Arc' }],
  })
  arcs: Arc[];

  @Prop()
  summary: string;

  @Prop()
  content: string;

  @Prop({
    type: Number,
    required: true,
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

// TODO: for some reason, this doesn't work
// ChapterSchema.index({ order: 1, book: 1 }, { unique: true });
// ChapterSchema.index({ title: 1, book: 1 }, { unique: true });
// ChapterSchema.index({ slug: 1, book: 1 }, { unique: true });
