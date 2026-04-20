// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3ekdZMq4yzAIRpFHZgHyPtTnHKxCVFhY",
  authDomain: "e-store-0.firebaseapp.com",
  databaseURL: "https://e-store-0-default-rtdb.firebaseio.com",
  projectId: "e-store-0",
  storageBucket: "e-store-0.firebasestorage.app",
  messagingSenderId: "34935751673",
  appId: "1:34935751673:web:2e705188ec9f3f1a74f328",
  measurementId: "G-6ZLK83YH88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, analytics, auth, db, rtdb };
