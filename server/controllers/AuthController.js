import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken04 } from "../utils/TokenGenerator.js";
import jwt from "jsonwebtoken";

export const checkUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    return res.json({ message: "Email Not Found", status: false });
    // throw new ApiError(400, "Email Not Found");
  }
  res.status(200).json(new ApiResponse(200, user, "User Found"));
});

export const onBoardUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("-password");

  if (user) {
    return res.json({ message: "Email Already Exists", status: false });
  }

  const createdUser = await User.create({
    name: req.body.name,
    email,
    about: req.body.about,
    profilePicture: req.body.image,
  });

  if (!createdUser)
    return res.json({ message: "User Creation Failed", status: false });

  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});

function groupUsersByInitial(users) {
  return users
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((acc, user) => {
      const initial = user.name.charAt(0).toUpperCase();
      if (!acc[initial]) acc[initial] = [];
      acc[initial].push(user);
      return acc;
    }, {});
}

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select(
    "-password -createdAt -updatedAt -__v"
  );

  const groupedUsers = groupUsersByInitial(users);

  res.status(200).json(new ApiResponse(200, groupedUsers, "users list"));
});

export const generateToken = asyncHandler(async (req, res) => {
  const appId = parseInt(process.env.ZEGO_APP_ID);
  const serverSecret = process.env.ZEGO_SERVER_ID;
  const { userId } = req.params;
  const effectiveTime = 3600;
  const payload = "";

  if (!appId || !serverSecret || !userId) {
    throw new ApiError(400, "userId is required");
  }

  const token = generateToken04(
    appId,
    userId,
    serverSecret,
    effectiveTime,
    payload
  );

  res.status(200).json(new ApiResponse(200, token));
});
