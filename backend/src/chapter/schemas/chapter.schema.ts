import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Arc } from '../../schemas/arc';
import { StoryElement } from '../../interfaces/story.element';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true })
export class Chapter implements StoryElement {
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
    type: [{ type: Types.ObjectId, ref: Arc.name }],
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
