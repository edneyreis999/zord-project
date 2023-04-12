import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Arc, ArcSchema } from '../../schemas/arc';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema()
export class Chapter {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    index: true,
    maxlength: 50,
  })
  name: string;

  @Prop()
  content: string;

  @Prop({ type: [{ type: ArcSchema }] })
  arcs: Arc[] = [];

  createdAt: Date;
  updatedAt: Date;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
