import React from "react";
import Login from "../screen/Login";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { USER, ACCESSTOKEN, REFRESHTOKEN } from "../constants/Constants";
import { storage } from "../../utils/storageUtils";
import axios from "axios";
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
      axios
      .delete("/api/v1/auth/deactivate", {
        headers: { Authorization: `Bearer ${storage.getString(ACCESSTOKEN)}` },
      })
      .then(function (response) {
        console.log("계정 탈퇴 완료")
        //성공하면 스토리지에서 토큰 제거한다.
        storage.delete(ACCESSTOKEN); //회원 탈퇴를 위해 스토리지에서 access token 삭제
        storage.delete(REFRESHTOKEN); //회원 탈퇴를 위해 스토리지에 refresh token 삭제
      })
      .catch(function (error) {
        //실패하면 실패 메세지..
        console.log("계정 탈퇴 기능 실패함..")
        console.log("access token 확인하기", storage.getString(ACCESSTOKEN));
        console.log("data", error.response.data);
        console.log("status",error.response.status)
        console.log("header",error.response.headers);
      })
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
