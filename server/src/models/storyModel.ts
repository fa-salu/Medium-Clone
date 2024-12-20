import mongoose, { Schema, type Document } from "mongoose";

export interface IStory extends Document {
  title: string;
  content: string;
  category: string;
  claps: number;
  likes: number;
  author: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const StorySchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  claps: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IStory>("Story", StorySchema);
