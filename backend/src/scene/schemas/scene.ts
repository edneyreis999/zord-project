import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SceneDocument = Scene & Document;

@Schema()
export class Scene {
  @Prop()
  name: string;

  @Prop()
  content: string;
}

export const SceneSchema = SchemaFactory.createForClass(Scene);
