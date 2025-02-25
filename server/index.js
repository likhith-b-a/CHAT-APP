import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { Server } from "socket.io";

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

const server = app.listen(process.env.PORT, () => {
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

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
      });
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
});
