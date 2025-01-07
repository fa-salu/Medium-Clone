import mongoose, { Schema, type Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  imageUri: string;
  likedPosts: mongoose.Types.ObjectId[];
  clappedPosts: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUri: { type: String, required: true },
    likedPosts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Story",
      default: [],
    },
    clappedPosts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Story",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>("User", userSchema);

export { UserModel };
