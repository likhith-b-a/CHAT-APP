import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyACUqpoXxn9OreSsaEEk0kgsvK1FWj8nwk",
  authDomain: "chat-application-6f039.firebaseapp.com",
  projectId: "chat-application-6f039",
  storageBucket: "chat-application-6f039.firebasestorage.app",
  messagingSenderId: "267701263769",
  appId: "1:267701263769:web:fe60bfecdb722c70604708",
  measurementId: "G-S8E4984EX1",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
