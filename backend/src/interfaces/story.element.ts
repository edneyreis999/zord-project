import mongoose from 'mongoose';

export interface StoryElement extends OrderedElement {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderedElement {
  order: number;
}
