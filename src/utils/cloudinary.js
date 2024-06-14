import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // ! upload file on cloudinary
    cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //!file upload done
    console.log("File is Uploaded on Cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // ! remove the temp file saved locally
    return null;
  }
};

export { uploadOnCloudinary };
