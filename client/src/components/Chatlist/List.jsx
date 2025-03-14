import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import {
  GET_ALL_CONTACTS_ROUTE,
  GET_INITIAL_CONTACTS_ROUTE,
} from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  const {
    state: { userInfo, userContacts, filteredContacts, messages},
    dispatch,
  } = useStateProvider();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { data },
        } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo._id}`);
        const { onlineUsers, users } = data;
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
        dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, [userInfo, messages]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts?.map((contact) => (
            <ChatLIstItem data={contact} key={contact._id} />
          ))
        : userContacts?.map((contact) => (
            <ChatLIstItem data={contact} key={contact._id} />
          ))}
    </div>
  );
}

export default List;
