import mongoose from 'mongoose';

export interface StoryElement {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  content: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
