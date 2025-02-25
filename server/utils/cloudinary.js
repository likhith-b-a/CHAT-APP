import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      asset_folder: "CHAT APP",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log(error); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

// const deleteFromCloudinary = async (publicId,resource_type) => {
//     try{
//         const response = await cloudinary.uploader.destroy(publicId,resource_type);

//     }catch(err){
//         console.log(err.message);
//     }
// }

// export {
//     uploadOnCloudinary,
//     deleteFromCloudinary
// }
