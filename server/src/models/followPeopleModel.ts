import mongoose, { Schema, type Document } from "mongoose";

interface Follow extends Document {
  follower: mongoose.Types.ObjectId;
  following: mongoose.Types.ObjectId;
}

const followSchema = new Schema<Follow>(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const FollowModel = mongoose.model<Follow>("Follow", followSchema);

export { FollowModel };
