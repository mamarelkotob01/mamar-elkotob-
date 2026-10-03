import { IStorageProvider, UploadOptions, UploadResult } from "./types";
import { CloudinaryProvider } from "./providers/cloudinary";

class StorageService {
  private provider: IStorageProvider;

  constructor() {
    // Default to Cloudinary, but can be made configurable via ENV
    this.provider = new CloudinaryProvider();
  }

  async uploadImage(file: Buffer, options?: UploadOptions): Promise<UploadResult> {
    return this.provider.upload(file, options);
  }

  async deleteImage(publicId: string): Promise<void> {
    return this.provider.delete(publicId);
  }

  // Allow switching providers dynamically if needed
  setProvider(provider: IStorageProvider) {
    this.provider = provider;
  }
}

export const storageService = new StorageService();
