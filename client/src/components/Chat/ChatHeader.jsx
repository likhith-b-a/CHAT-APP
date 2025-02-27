import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const {
    state: { currentChatUser },
    dispatch,
  } = useStateProvider();

  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCordinates({ x: e.pageX, y: e.pageY });
  };

  const contextMenuOptions = [
    {
      name: "Exit",
      callback: () => {
        dispatch({ type: reducerCases.SET_EXIT_CHAT });
      },
    },
  ];

  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "voice",
        roomId: Date.now(),
      },
    });
  };

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar
          type="sm"
          image={currentChatUser?.profilePicture || "/default_avatar.png"}
        />
        <div className="flex flex-col">
          <span className="text-primary-strong">
            {currentChatUser?.name || "Anonymous"}
          </span>
          <span className="text-secondary text-sm">
            {currentChatUser?.isOnline
              ? "Online"
              : `last seen at ${calculateTime(currentChatUser?.lastSeen)}`}
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={() => {
            dispatch({ type: reducerCases.SET_MESSAGE_SEARCH });
          }}
        />
        <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" 
          onClick={(e)=>{showContextMenu(e)}}
          id="context-opener"
        />
        {
          <ContextMenu
            options={contextMenuOptions}
            cordinates={contextMenuCordinates}
            ContextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        }
      </div>
    </div>
  );
}

export default ChatHeader;
