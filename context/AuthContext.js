import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [asyncCurrentUser, setAsyncCurrentUser] = useState();
  const [country, setCountry] = useState();
  const [loading, setLoading] = useState(false);
  const [stateLoader, setStateLoader] = useState(false);

  // Signup function
  async function signup(email, password, country) {
    try {
      setLoading(true);
      const authUsers = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(
        doc(db, "users", authUsers.user.uid),
        {
          owner_uid: authUsers.user.uid,
          email: authUsers.user.email,
          country: country,
        },
        { merge: true }
      );

      console.log(
        "🔥 firebase signup successful and user credentials set to storage",
        email
      );
    } catch (error) {
      setLoading(false);

      if (error.code === "auth/weak-password") {
        Alert.alert(
          "Error!",
          "Password should contain a minimum of 6 characters"
        );
      } else if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Error!",
          " The email you are trying to use has already been registered, Please sign in or use another email."
        );
      } else {
        Alert.alert(
          "Error!",
          "An error has occurred, please try again or contact support"
        );
      }
    }
  }

  // Login function

  function login(email, password) {
    setLoading(true);
    const authUsers = signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        console.log("🔥 firebase login successful");
      })
      .catch((error) => {
        setLoading(false);

        if (error.code === "auth/user-not-found") {
          Alert.alert(
            "Error!",
            "You are not registered as a user. Please register"
          );
        } else if (error.code === "auth/wrong-password") {
          Alert.alert(
            "Error!",
            "The password you have entered is incorrect, please try again or reset your password"
          );
        } else if (error.code === "auth/too-many-requests") {
          Alert.alert(
            "Error!",
            "You have entered an incorrect password too many times and your account has been temporarily disabled. Please try again after a few minutes or reset your password."
          );
        }

        console.log(error.message);
      });
  }

  //   Logout function
  async function logout() {
    try {
      await auth.signOut();
      console.log("signed out successfully");
    } catch (error) {
      console.log(error);
    }
  }

  // reset password function
  async function resetPassword(email) {
    try {
      setLoading(true);
      await auth.sendPasswordResetEmail(email);
      Alert.alert(
        "Success!",
        "password reset successfully, check your inbox for further details"
      );
      console.log("password reset successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/user-not-found") {
        Alert.alert(
          "Error!",
          "Sorry, the email you have entered is not attached to any account. Please check credentials and try again or register."
        );
      } else {
        Alert.alert("Success!", "An error has occurred. Please try again.");
      }

      console.log(error);
    }
  }

  // get user state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setStateLoader(true);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  if (currentUser) {
    // get user info

    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = getDoc(docRef)
      .then((doc) => {
        setCountry(doc.data().country);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Send verification email
  async function verifiyUserEmail() {
    try {
      setLoading(true);
      await currentUser.sendEmailVerification();
      Alert.alert(
        "Email sent!",
        "check your inbox to verify your email address and login once more"
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error!", "An error has occurred. Please try again.");
      console.log(error.message);
    }
  }

  // App state boolean
  const [userAppState, setUserAppState] = useState(true);

  // delete user pin
  const deleteUserPin = async () => {
    try {
      await AsyncStorage.removeItem("pin");
    } catch (e) {
      // remove error
      console.log(e);
    }

    console.log("Done.");
  };

  // get user pin state
  const [isPinEntered, setIsPinEntered] = useState(false);

  // Values
  const value = {
    loading,
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    country,
    verifiyUserEmail,
    userAppState,
    setUserAppState,
    stateLoader,
    deleteUserPin,
    setIsPinEntered,
    isPinEntered,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
