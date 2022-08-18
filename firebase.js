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
  apiKey: "AIzaSyAgtByYTKJ82t9GuTczultgWtGAcMdeX-w",
  authDomain: "blockchain-568c1.firebaseapp.com",
  projectId: "blockchain-568c1",
  storageBucket: "blockchain-568c1.appspot.com",
  messagingSenderId: "515600500650",
  appId: "1:515600500650:web:bd8d2a36a424e4fb77cdd3",
};

const defaultApp = initializeApp(firebaseConfig);

const auth = initializeAuth(defaultApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(defaultApp);

export { auth, db };
