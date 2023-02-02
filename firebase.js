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
  apiKey: "AIzaSyA9Ta4O2lu5oqU5x24rYvt1vMbeqB0L6CI",
  authDomain: "n-block-8cd3b.firebaseapp.com",
  projectId: "n-block-8cd3b",
  storageBucket: "n-block-8cd3b.appspot.com",
  messagingSenderId: "223779101319",
  appId: "1:223779101319:web:0016b39a452b4cc6da3622",
};

const defaultApp = initializeApp(firebaseConfig);

const auth = initializeAuth(defaultApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(defaultApp);

export { auth, db };
