import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Login from "./src/screen/Login"; // 슬래시 확인
import Chat from "./src/screen/Chat";
import Home from "./src/screen/Home";
import InfoScreen from "./src/screen/InfoScreen";
import Tabbar from "./src/screen/Tabbar";
import InfoName from "./src/screen/InfoName";
import InfoAge from "./src/screen/InfoAge";
import InfoGender from "./src/screen/InfoGender";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as Device from 'expo-device';

import { GOOGLE_KEY } from "./utils/storageUtils";
import SplashScreen from "./src/screen/SplashScreen";
import axios from "axios";
import { storage } from "./utils/storageUtils";
import { USER, ACCESSTOKEN, REFRESHTOKEN } from "./src/constants/Constants";

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(false); //로그인의 여부
  //처음에 앱을 켰을 때 토큰이 있는지를 확인하는 isSignin
  //로그인이 되어있으면 isSignin == true
  //회원인데 로그인이 안 되어있거나(로그인하라는 페이지 보여줘) 회원이 아니면(회원가입 페이지 보여줘) isSignin == false
  const [loading, setLoading] = useState(true); //로딩하는지 안하는지
  

  //앱이 실행이 될때 async storage에 access token이 있는지 확인한다 -> 우리 유저면 바로 tab으로
  useEffect(() => {
    //storage.delete(ACCESSTOKEN)
    //storage.delete(REFRESHTOKEN)
    console.log("========== 앱 실행 ==========")

    const bootstrapAsync = async () => {
      try {
        const accessToken = storage.getString(ACCESSTOKEN);
        const refreshToken = storage.getString(REFRESHTOKEN);
        console.log("access token : ", accessToken);
        console.log("refresh token : ", refreshToken);
        setIsSignIn(!!accessToken); 
        if (accessToken) {
          console.log("access token이 존재한다");
          console.log("deviceId : ", USER.DEVICEID, 
            "appVersion : ", USER.APPVERSION,
          "deviceOs : ", USER.DEVICEOS,
        "REFRESHTOken : ", storage.getString(REFRESHTOKEN))
          USER.DEVICEOS = Device.osName;
        
          //console.log(REFRESHDATA);
          
          //토큰이 있으면 우리 회원이다.
          //<1> refresh token으로 access token으로 재발급 받는다. -> 재발급에 성공하면 access token으로 유저 정보를 받고 홈 화면에 보인다.
          axios
            .patch("http://34.125.112.144:8000/api/v1/auth/refresh", {
                deviceId : USER.DEVICEID,  
                appVersion : USER.APPVERSION,
                deviceOs : USER.DEVICEOS,
                refreshToken : storage.getString(REFRESHTOKEN),
                requireUserInfo : true,
            })
            .then(function (response) { //성공 => refresh token으로 access token 재발급하기
              // -> 성공적으로 access token을 재발급 받았다면 access token으로 유저 정보를 받고 홈화면
              // -> refresh token 역시 만료되어 재발급이 불가한 경우, 로그인 페이지로
              try {
                console.log("리프레시 토큰 발급 성공");
                storage.set(ACCESSTOKEN, response.data.data.accessToken);
                //console.log("새로 발급된 access token : ", storage.getString(ACCESSTOKEN))
                USER.NICKNAME = response.data.data.nickname;
                console.log("nickname 저장 확인", USER.NICKNAME);
                setIsSignIn(true);
              }catch (error) {
                console.log("then 블록 내부 에러", error);
                setIsSignIn(false);
              }
            })
            .catch(function (error) {
              //refresh token도 만료되어 재발급이 불가한 경우 로그인 페이지로 이동하기
              //오류 발생 시 실행 알려주기
              console.log("리프레시 토큰 발급 실패?")
              console.log("refreshToken error(data): ", error.response.data);
              console.log("refreshToken error(stats)", error.response.status);
              console.log("refreshToken error(headers)", error.response.headers);
              setIsSignIn(false); //로그인 실패
            });
        } else { //토큰이 없으면, 다른 기기에서 접근한 것이거나 우리의 회원이 아니다. 로그인 화면을 보여준다.
          setIsSignIn(false);
          console.log("토큰이 없다 = 다른 기기에 접근한 유저이거나 새로운 유저이다. 로그인 화면을 보여준다");
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false); //로딩 완료
    };
    bootstrapAsync();
  }, []);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58C3A5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {isSignIn ? ( //로그인이 되어있는 경우 바로 홈 화면, 로그인이 안 되어있는 경우에는 로그인 화면과 회원가입 화면
          <>
            <Stack.Screen name="Tabbar" component={Tabbar}/>
            <Stack.Screen name="InfoScreen" component={InfoScreen} />
            <Stack.Screen name="Login" component={Login}/>
          </>
        ) : ( 
          <>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="InfoScreen" component={InfoScreen} />
            <Stack.Screen name="Tabbar" component={Tabbar}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default App;
