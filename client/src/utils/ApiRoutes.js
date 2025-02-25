export const HOST =
  "https://chat-app-w0y5.onrender.com";

const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`;
export const GET_ALL_CONTACTS_ROUTE = `${AUTH_ROUTE}/getUsers`;
export const GET_CALL_TOKEN = `${AUTH_ROUTE}/generate-token`;

export const ADD_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/addMessage`;
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/getMessages`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-image-message`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-audio-message`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGES_ROUTE}/get-initial-contacts`;
