import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // ? get request from front end
  // ? validation
  // ? check if user already exist
  // ? create user object -- create entry
  // ? remove password and refresh token
  // ? check from user creation
  // ? return res

  const { fullName, username, password } = req.body;
  console.log("fullName, username, password", fullName, username, password);

  if ([fullName, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }],
  });

  if (existedUser) {
    throw new ApiError(409, "Username Already Exist");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something Wnet wrong while Registering User");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registed Successfully"));
});

export { registerUser };
