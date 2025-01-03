import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  story: mongoose.Schema.Types.ObjectId;
  parentComment?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

// Explicitly type the model
const Comment: Model<IComment> = mongoose.model<IComment>(
  "Comment",
  CommentSchema
);

export default Comment;
