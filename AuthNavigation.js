import React, { useState } from "react";
import { SignedOutStack } from "./navigation/nav";
import { useAuth } from "./context/AuthContext";
import PinNavigation from "./PinNavigation";

const AuthNavigation = () => {
  const { currentUser, stateLoader } = useAuth();
  const [appReady, setAppReady] = useState(false);

  return <>{currentUser ? <PinNavigation /> : <SignedOutStack />}</>;
};

export default AuthNavigation;
