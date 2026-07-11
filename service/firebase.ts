import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCt31HjtYoivRwozPyArDlS_vezVHHM7AQ",
  authDomain: "todo-list-rn-6daa9.firebaseapp.com",
  projectId: "todo-list-rn-6daa9",
  storageBucket: "todo-list-rn-6daa9.firebasestorage.app",
  messagingSenderId: "897785454317",
  appId: "1:897785454317:web:5405ac94961dbec12d76e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// මෙතන තමයි auth සහ db නිර්මාණය කරලා export කරන්නේ
export const auth = getAuth(app);
export const db = getFirestore(app);