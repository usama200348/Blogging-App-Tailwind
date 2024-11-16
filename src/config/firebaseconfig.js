import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhlGUojSOX-RKjf087IOZ8buMstkYH4Tg",
  authDomain: "ba-blogging-app.firebaseapp.com",
  projectId: "ba-blogging-app",
  storageBucket: "ba-blogging-app.firebasestorage.app",
  messagingSenderId: "627077719482",
  appId: "1:627077719482:web:cf430989d3791721332983"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


