// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAT9q0aeaZPeaR_zbo2LCp1wmgNIkbWy_o",
  authDomain: "fest-d765b.firebaseapp.com",
  projectId: "fest-d765b",
  storageBucket: "fest-d765b.appspot.com",
  messagingSenderId: "320527410834",
  appId: "1:320527410834:web:ddd2d1198abb4fb6aca84b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
