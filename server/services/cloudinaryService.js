const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
  async uploadImage(filePath, folder = "ecommerce") {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });
      return { success: true, url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async uploadMultiple(files, folder = "ecommerce") {
    const results = [];
    for (const file of files) {
      const result = await this.uploadImage(file.path, folder);
      results.push(result);
    }
    return results;
  }

  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new CloudinaryService();
