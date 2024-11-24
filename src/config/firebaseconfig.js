import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxviSXz5rz24DqyCvck7YON-EsVohN9I8",
  authDomain: "blogs-715df.firebaseapp.com",
  projectId: "blogs-715df",
  storageBucket: "blogs-715df.firebasestorage.app",
  messagingSenderId: "838991249265",
  appId: "1:838991249265:web:3f4090b245438e30d180d0"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


