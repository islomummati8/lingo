import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwKTCts9z9NIoB9N63NgPd3UyXaJrt2fo",
  authDomain: "lingo-online-platform.firebaseapp.com",
  projectId: "lingo-online-platform",
  storageBucket: "lingo-online-platform.firebasestorage.app",
  messagingSenderId: "1070656250360",
  appId: "1:1070656250360:web:aca76db9cb3008ab7af60d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);