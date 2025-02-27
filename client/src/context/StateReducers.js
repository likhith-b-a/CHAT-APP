import { reducerCases } from "./constants";

export const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  messages: [],
  socket: undefined,
  messagesSearch: false,
  userContacts: [],
  onlineUsers: [],
  filteredContacts: [],
  videoCall: undefined,
  voiceCall: undefined,
  incomingVideoCall: undefined,
  incomingVoiceCall: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case reducerCases.SET_NEW_USER:
      return {
        ...state,
        newUser: action.newUser,
      };
    case reducerCases.SET_ALL_CONTACTS_PAGE:
      return {
        ...state,
        contactsPage: !state.contactsPage,
      };
    case reducerCases.CHANGE_CURRENT_CHAT_USER: {
      let updatedUserContacts = [];
      if (action.user) {
        state.userContacts.map((contact) => {
          const updatedContact =
            contact._id === action.user._id
              ? {
                  ...contact,
                  totalUnreadMessages: 0,
                }
              : contact;
          updatedUserContacts.push(updatedContact);
        });
      } else {
        updatedUserContacts = [...state.userContacts];
      }
      return {
        ...state,
        currentChatUser: action.user,
        userContacts: updatedUserContacts,
      };
    }
    case reducerCases.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case reducerCases.UPDATE_MESSAGES:
      const updatedMessages = state.messages.map((msg) =>
        msg.reciever.toString() === action.from
          ? { ...msg, messageStatus: "read" }
          : msg
      );
      return {
        ...state,
        messages: updatedMessages,
      };
    case reducerCases.SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    case reducerCases.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.newMessage],
      };
    case reducerCases.SET_MESSAGE_SEARCH:
      return {
        ...state,
        messagesSearch: !state.messagesSearch,
      };
    case reducerCases.SET_USER_CONTACTS:
      return {
        ...state,
        userContacts: action.userContacts,
      };
    case reducerCases.UPDATE_USER_CONTACTS:
      let updatedUserContacts = [];
      state.userContacts.map((contact) => {
        const updatedContact =
          contact._id === action.newMessage.sender
            ? {
                ...contact,
                messageId: action.newMessage._id,
                createdAt: action.newMessage.createdAt,
                message: action.newMessage.message,
                messageStatus: action.newMessage.messageStatus,
                totalUnreadMessages:
                  state.currentChatUser?._id === action.newMessage.sender
                    ? 0
                    : contact.totalUnreadMessages + 1,
                type: action.newMessage.type,
              }
            : contact;
        updatedUserContacts.push(updatedContact);
      });
      return {
        ...state,
        userContacts: updatedUserContacts,
      };
    case reducerCases.SET_ONLINE_USERS:
      if(state.currentChatUser){
        if(action.onlineUsers.includes(state.currentChatUser._id)){
          state.currentChatUser.isOnline = true;
        }else{
          state.currentChatUser.isOnline = false;
        }
      }
      return {
        ...state,
        onlineUsers: action.onlineUsers,
      };
    case reducerCases.SET_CONTACT_SEARCH:
      const filteredContacts = state.userContacts.filter((contact) =>
        contact.name.toLowerCase().includes(action.contactSearch.toLowerCase())
      );
      return {
        ...state,
        contactSearch: action.contactSearch,
        filteredContacts,
      };
    case reducerCases.SET_VIDEO_CALL:
      return {
        ...state,
        videoCall: action.videoCall,
      };
    case reducerCases.SET_VOICE_CALL:
      return {
        ...state,
        voiceCall: action.voiceCall,
      };
    case reducerCases.SET_INCOMING_VOICE_CALL:
      return {
        ...state,
        incomingVoiceCall: action.incomingVoiceCall,
      };
    case reducerCases.SET_INCOMING_VIDEO_CALL:
      return {
        ...state,
        incomingVideoCall: action.incomingVideoCall,
      };
    case reducerCases.END_CALL:
      return {
        ...state,
        videoCall: undefined,
        voiceCall: undefined,
        incomingVideoCall: undefined,
        incomingVoiceCall: undefined,
      };
    default:
      return state;
  }
};

export default reducer;
