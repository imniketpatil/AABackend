import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { TrekGuide } from "../models/trekguide.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addGuide = asyncHandler(async (req, res) => {
  const { name, bio, experience } = req.body;

  if ([name, bio, experience].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const guideImageLocalPath = req.files?.guideAvatar[0]?.path;
  console.log("Local image path:", guideImageLocalPath);

  if (!guideImageLocalPath) {
    throw new ApiError(400, "Image File is Required");
  }

  const imageOnCloudinary = await uploadOnCloudinary(guideImageLocalPath);
  console.log("Image uploaded to Cloudinary:", imageOnCloudinary);

  if (!imageOnCloudinary) {
    throw new ApiError(400, "Image File Didn't Upload");
  }

  const guide = await TrekGuide.create({
    name,
    bio,
    experience,
    images: imageOnCloudinary.url,
  });

  if (!guide) {
    throw new ApiError(500, "Something Went wrong while Adding Guide");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, guide, "Guide Created Successfully"));
});

const editGuide = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, bio, experience } = req.body;

  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);

  if (!req.files || !req.files.guideAvatar || !req.files.guideAvatar[0]) {
    throw new ApiError(400, "Image File is Required");
  }

  const guideImageLocalPath = req.files.guideAvatar[0].path;
  console.log("Local image path:", guideImageLocalPath);

  let imageOnCloudinary;
  try {
    imageOnCloudinary = await uploadOnCloudinary(guideImageLocalPath);
    console.log("Image uploaded to Cloudinary:", imageOnCloudinary);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new ApiError(500, "Image upload failed");
  }

  if (!imageOnCloudinary) {
    throw new ApiError(500, "Image File Didn't Upload");
  }

  const trekguide = await TrekGuide.findByIdAndUpdate(
    id,
    {
      name,
      bio,
      experience,
      images: imageOnCloudinary.url,
    },
    { new: true }
  );

  if (!trekguide) {
    throw new ApiError(500, "Something Went wrong while updating Guide");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, trekguide, "Guide Updated Successfully"));
});

const deleteGuide = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await TrekGuide.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Guide Deleted Successfully"));
});

export { addGuide, editGuide, deleteGuide };
