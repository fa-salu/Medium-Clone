import mongoose, { Schema, type Document } from "mongoose";

interface SavedCollectionEntry {
  collectionName: string;
  storyIds: mongoose.Types.ObjectId[];
}

interface SavedCollection extends Document {
  userId: mongoose.Types.ObjectId;
  collections: SavedCollectionEntry[];
}

const savedCollectionSchema = new Schema<SavedCollection>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collections: [
      {
        collectionName: { type: String, required: true },
        storyIds: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Story",
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

const SavedCollectionModel = mongoose.model<SavedCollection>(
  "SavedCollection",
  savedCollectionSchema
);

export { SavedCollectionModel };
