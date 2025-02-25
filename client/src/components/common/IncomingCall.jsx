import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React from "react";

function IncomingCall() {
  const {
    state: { userInfo, incomingVoiceCall, socket },
    dispatch,
  } = useStateProvider();

  const acceptCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...incomingVoiceCall,
        type: "in-coming",
      },
    });
    socket.current.emit("accept-incoming-call", { _id: incomingVoiceCall._id });
    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined,
    });
  };
  const rejectCall = () => {
    socket.current.emit("reject-voice-call", { from: incomingVoiceCall._id });
    dispatch({
      type: reducerCases.END_CALL,
    });
  };

  console.log(incomingVoiceCall);
  return (
    <div className="h-24 w-80 fixed mb-0 right-6 z-50 rounded-sm gap-5 flex items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14 bottom-8">
      <div>
        <Image
          src={incomingVoiceCall.profilePicture}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>{incomingVoiceCall.name}</div>
      <div className="text-xs">Incoming Voice Call</div>
      <div className="flex gap-2 mt-2">
        <button className="bg-red-500 gap-2 mt-2" onClick={rejectCall}>
          Reject
        </button>
        <button className="bg-green-500 gap-2 mt-2" onClick={acceptCall}>
          Accept
        </button>
      </div>
    </div>
  );
}

export default IncomingCall;
