import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';
import { Chapter } from '../../chapter/schemas/chapter.schema';
import { Scene } from '../../scene/schemas/scene.schema';
import { IArc } from '../interface/arc';

export type ArcDocument = HydratedDocument<Arc>;

@Schema({ timestamps: true, autoIndex: true })
export class Arc implements IArc {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    // required: true,
    // unique: true,
    index: true,
    maxlength: 50,
  })
  title: string;

  @Prop({
    required: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  })
  slug: string;

  @Prop()
  summary: string;

  @Prop()
  content: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Chapter.name,
  })
  chapter: Chapter;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scene' }],
  })
  scenes: Scene[];

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

export const ArcSchema = SchemaFactory.createForClass(Arc).set(
  'selectPopulatedPaths',
  false,
);
