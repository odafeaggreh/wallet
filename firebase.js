import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAaSFXgwoJM15-8jG77uCNH8zjZMwBe5U",
  authDomain: "blockchain-16f4c.firebaseapp.com",
  projectId: "blockchain-16f4c",
  storageBucket: "blockchain-16f4c.appspot.com",
  messagingSenderId: "673920211067",
  appId: "1:673920211067:web:39f63584d0eef0f1faeade",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

export { db, auth };
