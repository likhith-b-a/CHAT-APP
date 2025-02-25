import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      default: "text",
    },
    message:{
      type: String,
    },
    messageStatus:{
      type: String,
      default:"sent",
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
