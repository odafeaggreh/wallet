import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [country, setCountry] = useState();
  const [loading, setLoading] = useState(false);
  const [userIsVrified, setUserIsVerified] = useState(false);

  // Signup function
  async function signup(email, password, country) {
    try {
      setLoading(true);
      const authUsers = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      db.collection("users").doc(authUsers.user.uid).set(
        {
          owner_uid: authUsers.user.uid,
          email: authUsers.user.email,
          country: country,
        },
        { merge: true }
      );

      console.log("🔥 firebase signup successful", email, password);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error!",
        error.message + "\n\n What would you like to do next?"
      );
      console.log(error.message);
    }
  }

  // Login function

  async function login(email, password) {
    try {
      setLoading(true);
      const authUsers = await auth.signInWithEmailAndPassword(email, password);
      console.log("🔥 firebase login successful", email, password);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error!",
        error.message + "\n\n What would you like to do next ?",
        [
          {
            text: "OK",
            onPress: () => console.log("OK"),
            style: "cancel",
          },
          {
            text: "Sign Up",
            onPress: () => navigation.push("Signup"),
          },
        ]
      );
      console.log(error.message);
    }
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
        "\n\n password reset successfully, check your inbox for further details"
      );
      console.log("password reset successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error!",
        error.message + "\n\n What would you like to do next?"
      );
      console.log(error);
    }
  }

  // get user state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function (user) {
      setCurrentUser(user);

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (currentUser) {
    // get user info
    db.collection("users")
      .doc(currentUser.uid)
      .onSnapshot((doc) => {
        setCountry(doc.data().country);
      });
  }

  // Send verification email
  async function verifiyUserEmail() {
    try {
      setLoading(true);
      await currentUser.sendEmailVerification();
      Alert.alert(
        "Email sent!",
        "\n\n check your inbox to verify your email address"
      );
      setLoading(false); 
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error!",
        error.message + "\n\n What would you like to do next?"
      );
      console.log(error.message);
    }
  }

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
    userIsVrified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
