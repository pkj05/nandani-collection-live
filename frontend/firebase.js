// frontend/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ⚠️ Yahan apni Config Paste karein (Firebase Console se)

const firebaseConfig = {
  apiKey: "AIzaSyCTLmluC0ErZbK64HMX-QViTd11MbxEtlc",
  authDomain: "nandani-collection.firebaseapp.com",
  projectId: "nandani-collection",
  storageBucket: "nandani-collection.firebasestorage.app",
  messagingSenderId: "583929092865",
  appId: "1:583929092865:web:f50064563407a54a4a1900",
  measurementId: "G-5TS9WMTXET"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);