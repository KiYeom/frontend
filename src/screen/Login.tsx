import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
interface UserInfo {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const Login: React.FC<UserInfo> = ({ email, setEmail }) => {
  return (
    <View>
      <LoginButton email={email} setEmail={setEmail} />
      <LogoutButton email={email} setEmail={setEmail} />
    </View>
  );
};

export default Login;
