import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
  const {
    state: { userInfo, currentChatUser },
    dispatch,
  } = useStateProvider();
  return (
    <div
      className={`p-1 rounded-lg ${
        message.sender === currentChatUser._id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="relative">
        <Image
          src={`${message.message}`}
          className="rounded-lg "
          alt="asset"
          height={300}
          width={300}
        />
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-bubble-meta text-[11px] mw-fit pt-1">
            {calculateTime(message.updatedAt)}
          </span>
          <span className="text-bubble-meta`">
            {message.sender === userInfo._id && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ImageMessage;
