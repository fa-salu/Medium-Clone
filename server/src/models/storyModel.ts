import mongoose, { Schema, type Document } from "mongoose";

export interface IStory extends Document {
  title: string;
  content: string;
  category?: string;
  coverImage?: string;
  claps: number;
  likes: number;
  author: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const StorySchema: Schema = new Schema({
  title: { type: String, required: false },
  content: { type: String, required: false },
  category: { type: String, required: false },
  coverImage: { type: String, default: "" },
  claps: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IStory>("Story", StorySchema);
