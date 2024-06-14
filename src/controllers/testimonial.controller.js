import { Testimonial } from "../models/testimonial.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createTestimonial = asyncHandler(async (req, res) => {
  const { name, trek, rating, comment } = req.body;

  if ([name, trek, rating, comment].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const testimonialImageLocalPath = req.files?.testimonialAvatar[0]?.path;

  if (!testimonialImageLocalPath) {
    throw new ApiError(400, "Image File is Required");
  }

  const imageOnCloudinary = await uploadOnCloudinary(testimonialImageLocalPath);

  if (!imageOnCloudinary) {
    throw new ApiError(400, "Image File Didn't Upload");
  }

  const testimonial = await Testimonial.create({
    name,
    trek,
    rating,
    comment,
    images: imageOnCloudinary.url,
  });

  if (!testimonial) {
    throw new ApiError(500, "Something Went wrong while Adding Testimonial");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, testimonial, "Testimonial Created Successfully")
    );
});

export { createTestimonial };
