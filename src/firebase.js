import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-Kjfh0rDhOJRur9iggAdu_6QeVG8sXZA",
  authDomain: "todoapp-37682.firebaseapp.com",
  projectId: "todoapp-37682",
  storageBucket: "todoapp-37682.firebasestorage.app",
  messagingSenderId: "155742304898",
  appId: "1:155742304898:web:cf8c58eb5a3b7b2a52929b",
  measurementId: "G-8BLQME50V9",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

getAnalytics(app);

export default app;
