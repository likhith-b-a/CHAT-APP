import { useEffect, useRef } from "react";
import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";

const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

function ChatContainer() {
  const {
    state: { messages, currentChatUser, userInfo },
  } = useStateProvider();

  const chatContainerRef = useRef(null); // ✅ Step 1: Create ref for chat container

  // ✅ Step 2: Scroll to the bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar"
      ref={chatContainerRef} // ✅ Step 3: Attach ref to the chat container
    >
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {messages.map((message, index) => (
              <div
                key={message._id || index}
                className={`${
                  message.sender === currentChatUser._id
                    ? "justify-start"
                    : "justify-end"
                } flex`}
              >
                {message.type === "text" && (
                  <div
                    className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%]  ${
                      message.sender === currentChatUser._id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-all">{message.message}</span>
                    <div className="flex gap1 items-end">
                      <span className="text-bubble-meta text-[11px] mw-fit pt-1">
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.sender === userInfo._id && (
                          <MessageStatus
                            messageStatus={message.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {message.type === "image" && <ImageMessage message={message} />}
                {message.type === "audio" && <VoiceMessage message={message} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
