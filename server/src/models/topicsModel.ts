import mongoose, { type Schema, type Document } from "mongoose";

export interface ITopics extends Document {
  topics: string[];
}

const TopicSchema: Schema = new mongoose.Schema(
  {
    topics: {
      type: [String],
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITopics>("Topic", TopicSchema);
