import React, { useState, useEffect } from "react";
import { SignedInSack, SignedOutStack } from "./navigation/nav";
import { useAuth } from "./context/AuthContext";
import PinNavigation from "./PinNavigation";
import AppLoading from "expo-app-loading";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const AuthNavigation = () => {
  const { currentUser, stateLoader } = useAuth();
  const [appReady, setAppReady] = useState(false);

  if (!stateLoader) {
    return <AppLoading />;
  } else {
    return <>{currentUser ? <PinNavigation /> : <SignedOutStack />}</>;
  }
};

export default AuthNavigation;
