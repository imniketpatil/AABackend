import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Trek } from "../models/trek.model.js";

const addTrek = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    location,
    duration,
    difficulty,
    trekType,
    price,
    startDate,
    guides,
    images,
  } = req.body;

  if (
    [
      name,
      description,
      location,
      duration,
      difficulty,
      price,
      trekType,
      guides,
      startDate,
      images,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const trekImageLocalPaths = req.files?.trekImage.map((file) => file.path);
  console.log("Local image paths:", trekImageLocalPaths);

  if (!trekImageLocalPaths || trekImageLocalPaths.length === 0) {
    throw new ApiError(400, "At least one image file is required");
  }

  const imageOnCloudinaryPromises = trekImageLocalPaths.map(uploadOnCloudinary);
  const imagesOnCloudinary = await Promise.all(imageOnCloudinaryPromises);
  console.log("Images uploaded to Cloudinary:", imagesOnCloudinary);

  if (!imagesOnCloudinary.every((image) => image)) {
    throw new ApiError(400, "One or more image files didn't upload");
  }

  const trek = await Trek.create({
    name,
    description,
    location,
    duration,
    difficulty,
    trekType,
    price,
    guides,
    startDate,
    images: imagesOnCloudinary.map((image) => image.url),
  });

  if (!trek) {
    throw new ApiError(500, "Something went wrong while adding Trek Type");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, trek, "TrekType created successfully"));
});

export { addTrek };
