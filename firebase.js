// import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// import "firebase/compat/auth";
// import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN2AheH_fLcTjHNKyLv7tqOujbmfonS0I",
  authDomain: "rn-blockchain.firebaseapp.com",
  projectId: "rn-blockchain",
  storageBucket: "rn-blockchain.appspot.com",
  messagingSenderId: "802897162818",
  appId: "1:802897162818:web:d210a6b320276c9bb273db",
};

const defaultApp = initializeApp(firebaseConfig);

const auth = initializeAuth(defaultApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(defaultApp);

export { auth, db };
