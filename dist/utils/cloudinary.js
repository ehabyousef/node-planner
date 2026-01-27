"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary with your credentials
cloudinary_1.v2.config({
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
const uploadToCloudinary = async (fileBuffer, folder = "goals") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: folder,
            resource_type: "auto",
            transformation: [
                { width: 1000, height: 1000, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" },
            ],
        }, (error, result) => {
            if (error || !result) {
                console.error("Cloudinary upload error:", error);
                reject(new Error("Failed to upload image to Cloudinary"));
            }
            else {
                resolve({
                    id: result.public_id,
                    url: result.secure_url,
                });
            }
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public_id of the image to delete
 * @returns Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        return result;
    }
    catch (error) {
        console.error("Cloudinary delete error:", error);
        throw new Error("Failed to delete image from Cloudinary");
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.default = cloudinary_1.v2;
