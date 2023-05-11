import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chapter } from '../../chapter/schemas/chapter.schema';
import { IScene } from '../interface/Scene';

export type SceneDocument = HydratedDocument<Scene>;

@Schema({ timestamps: true, autoIndex: true })
export class Scene implements IScene {
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

export const SceneSchema = SchemaFactory.createForClass(Scene).set(
  'selectPopulatedPaths',
  false,
);
