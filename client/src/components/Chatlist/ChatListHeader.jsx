import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { useRouter } from "next/router";

function ChatListHeader() {
  const {
    state: { userInfo },
    dispatch,
  } = useStateProvider();

  const router = useRouter();

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
        name: "Logout",
        callback: () => {
          setIsContextMenuVisible(false);
          router.push("/logout")
        },
      },
    ];










  const handleAllContactsPage = async () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE,
    })
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar
          type="sm"
          image={userInfo?.profileImage || "/default_avatar.png"}
        />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-x1"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-x1"
            title="Menu"
            id="context-opener"
            onClick={showContextMenu}
          />

          {isContextMenuVisible && (
            <ContextMenu
              options={contextMenuOptions}
              cordinates={contextMenuCordinates}
              ContextMenu={isContextMenuVisible}
              setContextMenu={setIsContextMenuVisible}
            />
          )}
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;
