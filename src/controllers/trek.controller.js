import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Trek } from "../models/trek.model.js";
import { TrekGuide } from "../models/trekguide.model.js";

const addTrek = asyncHandler(async (req, res) => {
  const {
    name,
    subDescription,
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
      subDescription,
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
    subDescription,
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

const aggregateTrekWithGuides = asyncHandler(async (req, res) => {
  const trekWithGuide = await Trek.aggregate([
    {
      $lookup: {
        from: "trekguides", // The name of the TrekGuide collection in the database
        localField: "guides", // The field in the Trek collection that contains references to TrekGuide
        foreignField: "_id", // The field in the TrekGuide collection to join on
        as: "guideDetails", // The name of the field to add to the Trek documents with the matched guide details
      },
    },
    {
      $project: {
        name: 1,
        subDescription: 1,
        description: 1,
        location: 1,
        duration: 1,
        difficulty: 1,
        trekType: 1,
        price: 1,
        startDate: 1,
        images: 1,
        guideDetails: {
          name: 1,
          bio: 1,
          experience: 1,
          images: 1,
        },
      },
    },
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, trekWithGuide, "TrekWithGuide successfull"));
});

export { addTrek, aggregateTrekWithGuides };
