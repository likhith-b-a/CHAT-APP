import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function logout() {
  const {
    state: { socket, userInfo },
    dispatch,
  } = useStateProvider();

  const router = useRouter();

  useEffect(() => {
    socket.current.emit("signout", userInfo._id);
    dispatch({ type: reducerCases.SET_USER_INFO, userInfo: undefined });
    signOut(firebaseAuth);
    router.push("/login")
  }, [socket]);

  return <div className="bg-conversation-panel-background">logout</div>;
}

export default logout;
