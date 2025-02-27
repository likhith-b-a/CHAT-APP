import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addMesssage = asyncHandler(async (req, res) => {
  const { message, from, to } = req.body;
  const getUser = onlineUsers.get(to);

  if (message && from && to) {
    const newMessage = await Message.create({
      sender: from,
      reciever: to,
      message,
      messageStatus: getUser ? "delivered" : "sent",
    });
    const sender = await User.findById(from);
    const reciever = await User.findById(to);
    sender.sentMessages.push(newMessage._id);
    reciever.recievedMessages.push(newMessage._id);

    await sender.save();
    await reciever.save();
    res.status(201).json(new ApiResponse(201, newMessage, "Message sent"));
  } else {
    throw new ApiError(400, "From, to and message is required");
  }
});

export const getMessages = asyncHandler(async (req, res) => {
  const { from, to } = req.params;
  const messages = await Message.find({
    $or: [
      { $and: [{ sender: from }, { reciever: to }] },
      { $and: [{ sender: to }, { reciever: from }] },
    ],
  });

  const unreadMessages = [];
  messages.forEach((message, index) => {
    if (message.messageStatus !== "read" && message.sender == to) {
      messages[index].messageStatus = "read";
      unreadMessages.push(message._id);
    }
  });

  res
    .status(200)
    .json(new ApiResponse(200, messages, "requested messages sent"));
});

export const addImageMessage = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const image = await uploadOnCloudinary(req.file.buffer);
  if (!image) {
    throw new ApiError(400, "Image upload failed");
  }

  const newMessage = await Message.create({
    sender: from,
    reciever: to,
    message: image.url,
    type: "image",
  });

  const sender = await User.findById(from);
  const reciever = await User.findById(to);
  sender.sentMessages.push(newMessage._id);
  reciever.recievedMessages.push(newMessage._id);

  await sender.save();
  await reciever.save();

  res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message Sent Successfully"));
});

export const addAudioMessage = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  if (!req.file) {
    throw new ApiError(400, "Audio is missing");
  }

  const audio = await uploadOnCloudinary(req.file.buffer);
  if (!audio) {
    throw new ApiError(400, "Audio upload Failed");
  }

  const newMessage = await Message.create({
    sender: from,
    reciever: to,
    message: audio.url,
    type: "audio",
  });

  const sender = await User.findById(from);
  const reciever = await User.findById(to);
  sender.sentMessages.push(newMessage._id);
  reciever.recievedMessages.push(newMessage._id);

  await sender.save();
  await reciever.save();

  res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message Sent Successfully"));
});

export const getInitaialContactsWithMessages = asyncHandler(
  async (req, res) => {
    const { from } = req.params;

    const user = await User.findById(from)
      .select("sentMessages recievedMessages")
      .populate({
        path: "sentMessages recievedMessages",
        select: "-updatedAt -__v",
        populate: {
          path: "sender reciever",
          select: "name about email _id profilePicture isOnline lastSeen",
        },
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    if (!user) throw new ApiError(400, "No User Found");

    const messages = [
      ...(user.sentMessages || []),
      ...(user.recievedMessages || []),
    ];

    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      const isSender = msg.sender?._id.toString() === from;
      const calculatedId = (
        isSender ? msg.reciever?._id : msg.sender?._id
      )?.toString();
      if (msg.messageStatus === "sent") {
        messageStatusChange.push(msg.id);
      }
      if (!users.get(calculatedId)) {
        let user = {
          messageId: msg._id,
          type: msg.type,
          message: msg.message,
          messageStatus: msg.messageStatus,
          createdAt: msg.createdAt,
        };
        if (isSender) {
          user = { ...user, ...msg.reciever, totalUnreadMessages: 0 };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: msg.messageStatus !== "read" ? 1 : 0,
          };
        }
        users.set(calculatedId, { ...user });
      } else if (msg.messageStatus !== "read" && !isSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length) {
      await Message.updateMany(
        { _id: { $in: messageStatusChange } },
        { $set: { messageStatus: "delivered" } }
      );
    }

    res.status(200).json(
      new ApiResponse(200, {
        users: Array.from(users.values()),
        onlineUsers: Array.from(onlineUsers.keys()),
      })
    );
  }
);
