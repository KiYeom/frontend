import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { SetStateAction, Dispatch } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GOOGLE_KEY } from "../../utils/storageUtils";
import { useNavigation } from "@react-navigation/native";
import Login from "../screen/Login";
import axios from "axios";
import { storage } from "../../utils/storageUtils";
import { ACCESSTOKEN, REFRESHTOKEN, USER } from "../constants/Constants";
import InfoScreen from "../screen/InfoScreen";
//WebBrowser.maybeCompleteAuthSession();
// 로그인 버튼 누르면 웹 브라우저가 열리고, 구글 로그인 페이지로 이동함.
//web popup을 무시하기 위해 WebBrowser.maybeCompleteAuthSession()을 사용한다.
//사용하지 않으면 팝업 윈도우가 닫히지 않는다.
interface LoginButtonProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>; //setState 함수, string 타입
}
interface UserData {
  email: string;
  providerName: string;
  providerCode: string; //고유 ID
  nickname: string | null;
  birthdate: string | null;
  gender: number | null;
}

const LoginButton: React.FC<any> = ({ navigation }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={async () => {
          //console.log("눌리니ㅣ");
          GoogleSignin.configure({
            iosClientId:
              "94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com",
          });

          try {
            //const hasPreviousSignIn = await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            USER.EMAIL = userInfo.user.email;
            USER.PROVIDERCODE = userInfo.user.id;      

            console.log("로그인을 위해 전달하려는 데이터", USER);
            // 로그인에 성공하면 JWT 토큰을 부여받는다.
            axios
              .post("http://34.125.112.144:8000/api/v1/auth/login", {
                providerName: USER.PROVIDERNAME,
                providerCode: USER.PROVIDERCODE,
                deviceId: USER.DEVICEID,
                appVersion: USER.APPVERSION,
                deviceOs: USER.DEVICEOS,
                notificationToken: USER.NOTIFICATIONTOKEN,
              })
              .then(function (response) {
                //가입한 적이 있으면 서버는 토큰을 클라이언트에게 발급해준다.
                //발급한 토큰을 클라이언트는 storage에 key-value로 저장해둔다.
                storage.set(ACCESSTOKEN, response.data.data.accessToken); //access token을 storage에 저장
                storage.set(REFRESHTOKEN, response.data.data.refreshToken); //refresh token을 storage에 저장
                USER.NICKNAME = response.data.data.nickname;
                USER.GENDER = response.data.data.gender;
                USER.BIRTHDATE = response.data.data.birthdate;
                navigation.navigate("Tabbar"); //저장하고 메인 페이지로 이동
              })
              .catch(function (error) {
                console.log("error 발생, 로그인 실패", error);
                navigation.navigate("InfoScreen");
                //존재하지 않는 사용자는 code 404 (error.response.status) -> 인포메이션 페이지로 (회원가입 페이지 )
                if (error.response.status == 404) {
                  //console.log(error.response.data);
                  console.log("존재하지 않는 사용자");
                  navigation.navigate("InfoScreen");
                }
              });
          } catch (error) {
            console.log("구글 로그인 한 적이 없는 경우", error);
          }
          //navigation.navigate("InfoScreen");
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
