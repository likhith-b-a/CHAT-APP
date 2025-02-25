import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useStateProvider } from "@/context/StateContext";

const Container = dynamic(() => import("./Container"), { ssr: false });

function VideoCall() {
  const {
    state: { videoCall, socket, userInfo },
    dispatch,
  } = useStateProvider();

    useEffect(()=>{
      if(videoCall.type === "out-going"){
        socket.current.emit("outgoing-video-call",{
          to: videoCall._id,
          from:{
            _id: userInfo._id,
            profilePicture:userInfo.profileImage,
            name: userInfo.name,
          },
          callType: videoCall.callType,
          roomId : videoCall.roomId,
        })
      }
    },[userInfo, videoCall])

  return <Container data={videoCall}/>;
}

export default VideoCall;
