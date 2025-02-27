import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { Server } from "socket.io";
import { Message } from "./models/message.js";
import { User } from "./models/user.js";
import mongoose from "mongoose";

dotenv.config({
  path: "./.env",
});

async function connectToDB() {
  await connectDB();
}

try {
  await connectToDB();
} catch (error) {
  console.log("Database connection Failed", error);
}

const server = app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`server is running on port : ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", async (userId) => {
    onlineUsers.set(userId, socket.id);

    const messagesToUpdate = await Message.find({
      _id: {
        $in: (
          await User.findById(userId).select("recievedMessages")
        ).recievedMessages,
      },
      messageStatus: "sent",
    }).select("_id sender");

    // Extract message IDs
    const messageIds = messagesToUpdate.map((msg) => msg._id);

    // Update "sent" messages to "delivered"
    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { messageStatus: "delivered" } }
    );

    messagesToUpdate.forEach((msg) => {
      const senderSocket = onlineUsers.get(msg.sender.toString());

      if (senderSocket) {
        io.to(senderSocket).emit("update-message-status", {
          messageId: msg._id,
          status: "delivered",
        });
      }
    });
  });

  socket.on("send-msg", (data) => {
    console.log(data);
    console.log("Inside send-msg event listener");
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(sendUserSocket);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
      });
    }
  });

  socket.on("message-read", async ({ from, to }) => {
    try {
      // Find messages received by `from` user, sent by `to` user, that are not read yet
      console.log(from, to);
      const updatedMessages = await Message.updateMany(
        {
          sender: to,
          reciever: from,
          $or: [{ messageStatus: "sent" }, { messageStatus: "delivered" }],
        },
        { $set: { messageStatus: "read" } }
      );

      // If messages were updated, notify the sender (if online)
      const senderSocketId = onlineUsers.get(to);
      if (updatedMessages.modifiedCount > 0 && senderSocketId) {
        io.to(senderSocketId).emit("message-read", { from });
      }
    } catch (error) {
      console.error("Error updating read status:", error);
    }
  });

  socket.on("read-msg", async ({ message }) => {
    await Message.findByIdAndUpdate(message._id, { messageStatus: "read" });
    const senderSocket = onlineUsers.get(message.sender);
    if(senderSocket){
      io.to(senderSocket).emit("message-read",{from:message.reciever})
    }
  });

  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("incoming-voice-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });
  ("out-going-video-call");
  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("incoming-video-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on("reject-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.from);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("voice-call-rejected");
    }
  });

  socket.on("reject-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.from);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("video-call-rejected");
    }
  });

  socket.on("accept-incoming-call", ({ id }) => {
    const sendUserSocket = onlineUsers.get(id);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("accept-call");
    }
  });

  socket.on("disconnect", () => {
    //console.log(`User disconnected: ${socket.id}`);

    // Find the user who disconnected
    const userId = [...onlineUsers.entries()].find(
      ([, socketId]) => socketId === socket.id
    )?.[0];

    // Remove user from online users map
    if (userId) {
      onlineUsers.delete(userId);
      console.log(`User ${userId} removed from online users`);
    }

    socket.emit("disconnection");

    // Broadcast updated online users list
    // io.emit("update-online-users", Array.from(onlineUsers.keys()));
  });
});
