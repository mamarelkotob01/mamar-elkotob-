import { Router } from "express";
import multer from "multer";
import { storageService } from "../lib/storage/service";
import { logger } from "../lib/logger";

const router = Router();

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

/**
 * POST /api/upload/:folder
 * Uploads an image to a specific folder
 */
router.post("/:folder", upload.single("image"), async (req, res) => {
  try {
    const { folder } = req.params;
    if (typeof folder !== "string") {
      return res.status(400).json({ error: "Invalid folder parameter" });
    }
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const validFolders = ["users", "stories", "posts", "artworks"];
    if (!validFolders.includes(folder)) {
      return res.status(400).json({ error: "Invalid folder destination" });
    }

    const result = await storageService.uploadImage(file.buffer, {
      folder,
      tags: [folder, "upload"],
    });

    logger.info({ publicId: result.publicId, folder }, "Image uploaded successfully");
    
    return res.status(200).json(result);
  } catch (error: any) {
    logger.error({ error }, "Upload endpoint error");
    return res.status(500).json({ error: error.message || "Failed to upload image" });
  }
});

/**
 * DELETE /api/upload/:publicId
 * Deletes an image by its public ID
 */
router.delete("/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
    if (typeof publicId !== "string") {
      return res.status(400).json({ error: "Invalid publicId parameter" });
    }
    if (!publicId) {
      return res.status(400).json({ error: "No publicId provided" });
    }

    await storageService.deleteImage(publicId);
    
    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error: any) {
    logger.error({ error }, "Delete image endpoint error");
    return res.status(500).json({ error: error.message || "Failed to delete image" });
  }
});

export default router;
