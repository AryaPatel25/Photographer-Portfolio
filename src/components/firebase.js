// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxtlzk4VweDmkKMTf6mNZcTIhqwpiLNtU",
  authDomain: "portfolio-website-d19d0.firebaseapp.com",
  projectId: "portfolio-website-d19d0",
  storageBucket: "portfolio-website-d19d0.firebasestorage.app",
  messagingSenderId: "816149486890",
  appId: "1:816149486890:web:3d898b92748d01741d1253",
  measurementId: "G-MBG7GHP70Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
