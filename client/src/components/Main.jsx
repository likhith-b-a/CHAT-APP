import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";

function Main() {
  const router = useRouter();
  const {
    state: {
      userInfo,
      currentChatUser,
      messagesSearch,
      videoCall,
      voiceCall,
      incomingVoiceCall,
      incomingVideoCall,
      messages,
      userContacts,
    },
    dispatch,
  } = useStateProvider();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const socket = useRef();
  const [socketEvent, setSocketEvent] = useState(false);

  useEffect(() => {
    if (!userInfo) return;
    socket.current = io(HOST);
    socket.current.emit("add-user", userInfo._id);
    dispatch({ type: reducerCases.SET_SOCKET, socket });
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      setSocketEvent(true);

      socket.current.on("message-read", ({ from }) => {
        dispatch({
          type: reducerCases.UPDATE_MESSAGES,
          from,
        });
      });

      socket.current.on("users-online", ({ users: onlineUsers }) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
          status: "online",
        });
      });

      socket.current.on("users-offline", ({ users: onlineUsers }) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
          status: "offline",
        });
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("voice-call-rejected", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });

      socket.current.on("video-call-rejected", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });
    }
  }, [socket.current]);

  useEffect(() => {
    if (!socket.current) return;
    socket.current.off("msg-recieve");
    socket.current.on("msg-recieve", (data) => {
      dispatch({
        type: reducerCases.UPDATE_USER_CONTACTS,
        newMessage: data.message,
      });

      if (currentChatUser?._id === data.from) {
        socket.current.emit("read-msg", {
          message: data.message,
        });

        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      }
    });
  }, [socket.current, currentChatUser]);

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const {
          data: { data: messages },
        } = await axios.get(
          `${GET_MESSAGES_ROUTE}/${userInfo._id}/${currentChatUser._id}`
        );
        dispatch({ type: reducerCases.SET_MESSAGES, messages: messages });
      } catch (error) {
        console.log(error);
      }
    };
    if (currentChatUser?._id) {
      getMessages();
    }
    if (currentChatUser) {
      socket.current.emit("message-read", {
        from: userInfo._id,
        to: currentChatUser._id,
      });
    }
  }, [currentChatUser]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });

      if (!data.status) {
        router.push("/login");
      }
      if (data.data) {
        const {
          name,
          email,
          profilePicture: profileImage,
          about: status,
          _id,
        } = data.data;

        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            name,
            email,
            profileImage,
            status,
            _id,
          },
        });
      }
    }
  });

  return (
    <>
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-width-full overflow-hidden">
          <ChatList />
          {currentChatUser ? (
            <div
              className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;
