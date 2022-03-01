import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN2AheH_fLcTjHNKyLv7tqOujbmfonS0I",
  authDomain: "rn-blockchain.firebaseapp.com",
  projectId: "rn-blockchain",
  storageBucket: "rn-blockchain.appspot.com",
  messagingSenderId: "802897162818",
  appId: "1:802897162818:web:d210a6b320276c9bb273db",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

export { db, auth };
