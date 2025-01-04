import mongoose, { Schema, type Document } from "mongoose";

interface FollowTopics extends Document {
  userId: mongoose.Types.ObjectId;
  topics: string[];
}

const FollowTopicsSchema = new Schema<FollowTopics>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    topics: { type: [String], default: [] },
  },
  { timestamps: true }
);

const FollowTopicsModel = mongoose.model<FollowTopics>(
  "FollowTopics",
  FollowTopicsSchema
);

export { FollowTopicsModel };
