import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function onboarding() {
  const router = useRouter();
  const {
    state: { userInfo, newUser },
    dispatch,
  } = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.email) router.push("/");
  }, [newUser, userInfo, router]);

  const validateDetails = () => {
    if (name.length < 3) {
      return false;
    }
    return true;
  };

  const onBoardHandler = async () => {
    if (!validateDetails()) return;

    try {
      const { data } = await axios.post(ONBOARD_USER_ROUTE, {
        email: userInfo.email,
        name,
        about,
        image,
      });
      if (data.status) {
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
        dispatch({ type: reducerCases.SET_NEW_USER, newUser: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <h2 className="text-3xl">Create Your Profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input
            name="Display Name"
            state={name}
            setState={setName}
            label
          ></Input>
          <Input name="About" state={about} setState={setAbout} label></Input>
          <div className="flex items-center justify-center">
            <button
              className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition-all w-full justify-center"
              onClick={onBoardHandler}
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage}></Avatar>
        </div>
      </div>
    </div>
  );
}

export default onboarding;
