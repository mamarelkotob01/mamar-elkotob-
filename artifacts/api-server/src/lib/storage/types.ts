export type StorageType = "cloudinary" | "local" | "s3";

export interface UploadResult {
  imageUrl: string;
  publicId: string;
  storageType: StorageType;
}

export interface UploadOptions {
  folder?: string;
  filename?: string;
  tags?: string[];
}

export interface IStorageProvider {
  upload(file: Buffer, options?: UploadOptions): Promise<UploadResult>;
  delete(publicId: string): Promise<void>;
}
