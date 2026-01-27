import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

// Load environment variables (needed when this file is imported before dotenv is initialized elsewhere)
dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary from buffer
 * @param fileBuffer - File buffer from multer
 * @param folder - Cloudinary folder to organize uploads (default: 'goals')
 * @returns Object containing Cloudinary public_id and secure_url
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "goals"
): Promise<{ id: string; url: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
        transformation: [
          { width: 1000, height: 1000, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          reject(new Error("Failed to upload image to Cloudinary"));
        } else {
          resolve({
            id: result.public_id,
            url: result.secure_url,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public_id of the image to delete
 * @returns Deletion result
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

export default cloudinary;
