import React, { useState } from "react";
import { useEffect } from "react";
import { auth } from "./firebase";
import { SignedInSack, SignedOutStack } from "./navigation/nav";
import { DrawerNavStack } from "./navigation/draw";
import NavigationDrawer from "./components/NavigationDrawer";
import { useAuth } from "./context/AuthContext";

const AuthNavigation = () => {
  const { currentUser } = useAuth();

  return <>{currentUser ? <SignedInSack /> : <SignedOutStack />}</>;
};

export default AuthNavigation;
