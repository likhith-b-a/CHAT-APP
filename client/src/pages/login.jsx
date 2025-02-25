import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const router = useRouter();

  const { state: { userInfo, newUser }, dispatch } = useStateProvider();

  useEffect(() => {
    if (userInfo?.email && !newUser) router.push("/");
  }, [userInfo, newUser]);

  const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider);
    try {
      if (!email) return;

      const { data } = await axios.post(CHECK_USER_ROUTE, { email });


      if (!data.status) {
        dispatch({
          type: reducerCases.SET_NEW_USER,
          newUser: true,
        });
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            name,
            email,
            profileImage,
            status: "",
          },
        });
        router.push("/onboarding");
      }else{
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            name: data.data.name,
            email: data.data.email,
            profileImage: data.data.profilePicture,
            status: data.data.about,
            _id: data.data._id,
          },
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-opacity-30 backdrop-blur-xl"></div>
      <div className="relative z-10 bg-white p-12 rounded-2xl shadow-2xl text-center max-w-sm w-full transform transition duration-300 hover:scale-105">
        <div className="flex justify-center mb-6">
          <Image
            src="/whatsapp.gif"
            alt="App Logo"
            width={120}
            height={120}
            className="rounded-full shadow-md"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          ChatVerse
        </h1>
        <button
          onClick={handleClick}
          className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition-all w-full justify-center"
        >
          <FcGoogle size={24} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
