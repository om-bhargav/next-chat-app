import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

function bufferToStream(buffer: Buffer) {
  return Readable.from(buffer);
}

async function uploadSingleImage(
  file: File,
  folder = "next-chat-app"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }

        resolve(result.secure_url);
      }
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
}

export async function uploadImages(
  files: File[],
  folder = "next-chat-app"
): Promise<string[]> {
  return Promise.all(
    files.map((file) => uploadSingleImage(file, folder))
  );
}