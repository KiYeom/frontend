import React from "react";
import Login from "../screen/Login";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import axios from "axios";
import { useState } from "react";
import { storage } from "../../utils/storageUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { USER, ACCESSTOKEN, REFRESHTOKEN } from "../constants/Constants";
const LogoutButton: React.FC<any> = ({ navigation }) => {
  const handleLogout = async () => {
    setIsDisabled(true)
    //Google객체를 사용하려면 반드시 configure 메서드를 호출해야 한다.
    GoogleSignin.configure({
      iosClientId:
        "94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com",
    });
    const accessToken = storage.getString(ACCESSTOKEN);
    //storage.delete(ACCESSTOKEN);
    //storage.delete(REFRESHTOKEN);
    try {
      await GoogleSignin.signOut(); //계정 로그아웃
      //로그아웃 api 호출
      axios
        .delete("http://34.125.112.144:8000/api/v1/auth/logout", {
          headers: { Authorization: `Bearer ${accessToken}` },
          data : {deviceId : USER.DEVICEID},
        })
        .then(function (response) {
          //성공 : 로그아웃이 됨
          console.log("서버 로그아웃 완료. response : ", response);
        })
        .catch(function (error) {
          //실패한 경우 >> 로그인 페이지로
          //navigation.navigate("Login");
          //setIsSignIn(false); //로그인 실패
          console.log("로그아웃 실패함", error);
          console.log("data", error.response.data);
          console.log("status",error.response.status)
          console.log("header",error.response.headers);
        });
      console.log("눌림");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };
  const [isDisabled, setIsDisabled] = useState(false);
  return (
    <TouchableOpacity>
      <Button onPress={handleLogout} mode="contained" buttonColor="black" disabled = {isDisabled}>
        로그아웃 버튼!
      </Button>
    </TouchableOpacity>
  );
};
export default LogoutButton;
