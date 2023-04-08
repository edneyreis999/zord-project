import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Arc, ArcSchema } from './arc';

export type ChapterDocument = Chapter & Document;

@Schema()
export class Chapter {
  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop({ type: [{ type: ArcSchema }] })
  arcs: Arc[] = [];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
