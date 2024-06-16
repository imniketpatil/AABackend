import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { TrekType } from "../models/trektype.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addTrekType = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if ([name, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const trekTypeImageLocalPath = req.files?.trekTypeImage[0]?.path;
  console.log("Local image path:", trekTypeImageLocalPath);

  if (!trekTypeImageLocalPath) {
    throw new ApiError(400, "Image File is Required");
  }

  const imageOnCloudinary = await uploadOnCloudinary(trekTypeImageLocalPath);
  console.log("Image uploaded to Cloudinary:", imageOnCloudinary);

  if (!imageOnCloudinary) {
    throw new ApiError(400, "Image File Didn't Upload");
  }

  const trekType = await TrekType.create({
    name,
    description,
    images: imageOnCloudinary.url,
  });

  if (!trekType) {
    throw new ApiError(500, "Something Went wrong while Adding Trek Type");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, trekType, "TrekType Created Successfully"));
});

const editTrekType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);

  if (!req.files || !req.files.trekTypeImage || !req.files.trekTypeImage[0]) {
    throw new ApiError(400, "Image File is Required");
  }

  const trekTypeImageLocalPath = req.files.trekTypeImage[0].path;
  console.log("Local image path:", trekTypeImageLocalPath);

  let imageOnCloudinary;
  try {
    imageOnCloudinary = await uploadOnCloudinary(trekTypeImageLocalPath);
    console.log("Image uploaded to Cloudinary:", imageOnCloudinary);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new ApiError(500, "Image upload failed");
  }

  if (!imageOnCloudinary) {
    throw new ApiError(500, "Image File Didn't Upload");
  }

  const trekType = await TrekType.findByIdAndUpdate(
    id,
    {
      name,
      description,
      images: imageOnCloudinary.url,
    },
    { new: true }
  );

  if (!trekType) {
    throw new ApiError(500, "Something Went wrong while updating Guide");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, trekType, "Guide Updated Successfully"));
});

const deleteTrekType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await TrekType.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Guide Deleted Successfully"));
});

export { addTrekType, editTrekType, deleteTrekType };
