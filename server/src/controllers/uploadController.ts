import type { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import stream from "node:stream";

// Upload file to Cloudinary
export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto" }, // Automatically handles both images and videos
        (error, result) => {
          if (error) {
            res.status(500).json({
              error: "Failed to upload to Cloudinary",
              details: error,
            });
          } else {
            res.status(200).json({ url: result?.secure_url });
          }
        }
      )
      .end(file.buffer);
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(500).json({ error: "Internal server error", details: error });
  }
};
