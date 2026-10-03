import { v2 as cloudinary } from "cloudinary";
import { IStorageProvider, UploadOptions, UploadResult } from "../types";
import { logger } from "../../logger";

export class CloudinaryProvider implements IStorageProvider {
  constructor() {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      logger.warn("Cloudinary credentials missing. Uploads will fail.");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async upload(file: Buffer, options?: UploadOptions): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || "general",
          public_id: options?.filename,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            logger.error({ error }, "Cloudinary upload error");
            return reject(error);
          }
          if (!result) {
            return reject(new Error("Cloudinary upload failed: No result"));
          }

          resolve({
            imageUrl: result.secure_url,
            publicId: result.public_id,
            storageType: "cloudinary",
          });
        }
      );

      uploadStream.end(file);
    });
  }

  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      logger.error({ error, publicId }, "Cloudinary delete error");
      throw error;
    }
  }
}
