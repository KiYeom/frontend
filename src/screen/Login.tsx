import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import { StyleSheet } from "react-native";
import { GOOGLE_KEY } from "../../utils/storageUtils";
interface UserInfo {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const Login: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/cookieSplash.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.btnContainer}>
        <LoginButton navigation={navigation} />
        <LoginButton />
        <LoginButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 50,
  },
  image: {
    width: 500,
    height: 500,
  },
  btnContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    color: "#333",
  },
});
export default Login;
