import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string = 'lumen_deli'
): Promise<string> => {
  if (!useCloudinary) {
    console.log('[CLOUDINARY MOCK] Saving uploaded file locally...');
    
    // Define public upload destination
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filename = `${folder}-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
    const filePath = path.join(uploadDir, filename);
    
    await fs.promises.writeFile(filePath, fileBuffer);
    
    const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
    return `${serverUrl}/uploads/${filename}`;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: folder, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || '');
        }
      )
      .end(fileBuffer);
  });
};
