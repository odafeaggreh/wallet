import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [asyncCurrentUser, setAsyncCurrentUser] = useState();
  const [country, setCountry] = useState();
  const [loading, setLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [logInLoading, setLogInLoading] = useState(false);
  const [stateLoader, setStateLoader] = useState(false);

  // Signup function
  async function signup(email, password, country) {
    try {
      setSignInLoading(true);
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
          created_at: new Date().toISOString(),
          localCurrency: {
            code: "USD",
            name: "US Dollar",
          },
        },
        { merge: true }
      );

      console.log(
        "🔥 firebase signup successful and user credentials set to storage",
        email
      );
    } catch (error) {
      setSignInLoading(false);

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
    setLogInLoading(true);
    const authUsers = signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLogInLoading(false);
        console.log("🔥 firebase login successful");
      })
      .catch((error) => {
        setLogInLoading(false);

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

  // Currency info from DB
  const [code, setCode] = useState();
  const [name, setName] = useState();

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
        setCode(doc.data().localCurrency.code);
        setName(doc.data().localCurrency.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Send verification email
  async function verifiyUserEmail() {
    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
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
      Alert.alert("Success!", "Your pin has been deleted");
    } catch (e) {
      Alert.alert("Error!", "An error has occurred. Please try again.");
      console.log(e);
    }

    console.log("Done.");
  };

  // get user pin state
  const [isPinEntered, setIsPinEntered] = useState(false);

  const [reAuthResults, setReAuthResults] = useState();

  // Reauthenticate user
  async function reauthenticateUser(userProvidedPassword) {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      userProvidedPassword
    );

    return (result = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    ));
  }

  // Update user password
  async function upDateUserPassword(user, newPassword) {
    try {
      setLoading(true);
      await updatePassword(user, newPassword);

      alert("Password updated successfully");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err.message);

      if (err.code === "auth/requires-recent-login") {
        alert("Please logout and login again to update your password");
      } else if (err.code === "auth/weak-password") {
        alert("Password should contain a minimum of 6 characters");
      } else {
        alert("An error has occurred. Please try again.");
      }
    }
  }

  const [globalCurrency, setGlobalCurrency] = useState("USD");
  const [currencyName, setCurrencyName] = useState("US Dollar");
  const [currencyAmount, setCurrencyAmount] = useState(1);
  const [totalWallet, setTotalWallet] = useState(0);

  useEffect(() => {
    if (code) {
      setGlobalCurrency(code);
      setCurrencyName(name);
    }
  }, [code, name]);

  // get transactions
  const [transactions, setTransactions] = useState([]);
  const [topUp, setTopUp] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function getTransactions() {
    if (currentUser) {
      const docRef = collection(db, "users", currentUser.uid, "transactions");
      const q = query(docRef, orderBy("date"));

      const qSnap = getDocs(query(docRef, orderBy("date", "desc")))
        .then((snapshot) => {
          const objData = snapshot.docs.map((doc) => {
            return doc.data();
          });

          setTransactions(objData);
          if (objData.length === 0) {
            setTopUp(true);
          } else if (objData.length > 0) {
            setTopUp(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  // Home page holdngs
  const [fireHoldings, setFireHoldings] = useState([]);
  const [homeTopUp, setHomeTopUp] = useState(false);
  const [skeleton, setSkeleton] = useState(true);

  async function getMyHoldings() {
    if (currentUser) {
      const docRef = collection(db, "users", currentUser.uid, "holdings");

      try {
        const qSnap = await getDocs(docRef);
        const objData = qSnap.docs.map((doc) => {
          return doc.data();
        });

        if (objData.length > 0) {
          setHomeTopUp(true);
        } else {
          setHomeTopUp(false);
        }

        setFireHoldings(objData);
      } catch (error) {
        setHomeTopUp(false);
        console.log(error);
      }
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
    userAppState,
    setUserAppState,
    stateLoader,
    deleteUserPin,
    setIsPinEntered,
    isPinEntered,
    upDateUserPassword,
    globalCurrency,
    setGlobalCurrency,
    currencyName,
    setCurrencyName,
    setTotalWallet,
    currencyAmount,
    transactions,
    topUp,
    getTransactions,
    transactions,
    refreshing,
    setRefreshing,
    setFireHoldings,
    getMyHoldings,
    fireHoldings,
    homeTopUp,
    signInLoading,
    logInLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
