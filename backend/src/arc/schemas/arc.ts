import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Scene, SceneSchema } from '../../scene/schemas/scene.schema';

export type ArcDocument = Arc & Document;

@Schema()
export class Arc {
  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop({ type: [{ type: SceneSchema }] })
  scenes: Scene[] = [];

  @Prop()
  path: string;
}

export const ArcSchema = SchemaFactory.createForClass(Arc);
