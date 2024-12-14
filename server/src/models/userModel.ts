import mongoose, { Schema, type Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  imageUri: string;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Email is unique
    imageUri: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>("User", userSchema);

export { UserModel };
