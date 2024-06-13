import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something Went Wrong In Refresh and Access Token");
  }
};

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

  const existedUser = await User.findOne({
    $or: [{ username }],
  });

  if (existedUser) {
    throw new ApiError(409, "Username Already Exist");
  }

  let user;
  if (!existedUser) {
    user = await User.create({
      fullName,
      username: username.toLowerCase(),
      password,
    });
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something Went wrong while Registering User");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registed Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // ? req body -> data
  // ? username
  // ? find user
  // ? password check
  // ? access and refresh token
  // ? send cookies

  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User Does not Exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password Doesn't Match");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export { registerUser, loginUser, logoutUser };
