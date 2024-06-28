import React from "react";
import Login from "../screen/Login";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { deleteDate } from "../../utils/storageUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GOOGLE_KEY } from "../../utils/storageUtils";
const DeleteAccoutButton: React.FC<any> = ({ navigation }) => {
  const handleLogout = async () => {
    //Google객체를 사용하려면 반드시 configure 메서드를 호출해야 한다.
    GoogleSignin.configure({
      iosClientId:
        "94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com",
    });
    try {
      await GoogleSignin.signOut(); //계정 로그아웃
      //deleteDate(GOOGLE_KEY);
      console.log("눌림");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <TouchableOpacity>
      <Button onPress={handleLogout} mode="contained">
        계정 탈퇴 버튼..
      </Button>
    </TouchableOpacity>
  );
};
export default DeleteAccoutButton;
