import axios from "axios";

export type UploadFolder = "users" | "stories" | "posts" | "artworks";

export interface UploadResult {
  imageUrl: string;
  publicId: string;
  storageType: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const uploadService = {
  /**
   * Uploads an image to the backend
   * @param file The file object from input
   * @param folder Destination folder
   */
  async uploadImage(file: File, folder: UploadFolder): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post<UploadResult>(
      `${API_BASE_URL}/upload/${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  /**
   * Deletes an image from the backend
   * @param publicId The public ID of the image
   */
  async deleteImage(publicId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/upload/${publicId}`);
  },
};
