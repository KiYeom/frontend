import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { SetStateAction, Dispatch } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageData, getData } from "../../utils/storageUtils";
//WebBrowser.maybeCompleteAuthSession();
// 로그인 버튼 누르면 웹 브라우저가 열리고, 구글 로그인 페이지로 이동함.
//web popup을 무시하기 위해 WebBrowser.maybeCompleteAuthSession()을 사용한다.
//사용하지 않으면 팝업 윈도우가 닫히지 않는다.
interface LoginButtonProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>; //setState 함수, string 타입
}
interface UserData {
  userID: string;
  email: string;
  name: string | null;
  age: number | null;
  gender: string | null;
}

const LoginButton: React.FC = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={async () => {
          GoogleSignin.configure({
            iosClientId:
              "94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com",
          });

          try {
            const hasPreviousSignIn = await GoogleSignin.hasPlayServices();
            //hasPlayServices : 이전에 로그인한 적이 있으면 true, 없으면 false
            const userInfo = await GoogleSignin.signIn();
            const userID = userInfo.user.id; //유저의 고유 아이디값
            const value: UserData = {
              userID: userID,
              email: userInfo.user.email,
              name: null,
              age: null,
              gender: null,
            }; //storage에 저장할 데이터
            console.log("value : ", value); //유저의 정보 value를 만들었음
            storageData("userInfo", value); //만든 데이터를 async storage에 저장

            //signIn : 처음 로그인하면 구글 로그인 모달창을 띄워줌. 성공하면 Promise(object), 실패하면 error를 리턴
            //console.log("hasPreviousSignIn : ", hasPreviousSignIn);
            //console.log("userInfo : ", userInfo);
            //console.log("userInfo type : ", typeof userInfo);
            //console.log("setEmail 함수 실행 : ", email);
          } catch (error) {
            console.log(error);
          }
        }}
        disabled={false} // Set to true to disable the button
      />
    </TouchableOpacity>
  );
};

export default LoginButton;

const styles = StyleSheet.create({
  container: {
    margin: 7,
  },
});
