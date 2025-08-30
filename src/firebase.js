import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyAh8PQv4yTiDOaACnkzM5-K2N1W7iBhd80",
  authDomain: "meal-planner-97210.firebaseapp.com",
  projectId: "meal-planner-97210",
  storageBucket: "meal-planner-97210.firebasestorage.app",
  messagingSenderId: "631139780167",
  appId: "1:631139780167:web:458a47e6fa5f4a57489362"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
