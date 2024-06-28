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
import { getData, storageData } from "./utils/storageUtils";
import { GOOGLE_KEY } from "./utils/storageUtils";
import SplashScreen from "./src/screen/SplashScreen";

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [email, setEmail] = useState(""); //상태관리 컴포넌트 외부가 아닌, "컴포넌트 안에서" 호출되어야 한다.
  const [isSignIn, setIsSignIn] = useState(false);
  //처음에 앱을 켰을 때 토큰이 있는지를 확인하는 isSignin
  //로그인이 되어있으면 isSignin == true
  //회원인데 로그인이 안 되어있거나(로그인하라는 페이지 보여줘) 회원이 아니면(회원가입 페이지 보여줘) isSignin == false
  const [isLogin, setIsLogin] = useState(false); //로그인 여부
  const [route, setRoute] = useState("Login");
  const [loading, setLoading] = useState(true); //로딩하는지 안하는지

  //앱이 실행이 될때 async storage에 access token이 있는지 확인한다 -> 우리 유저면 바로 tab으로
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await getData("ACCESS_TOKEN");
        if (token) {
          //토큰이 있으면 우리 회원이다. -> 바로 탭 화면
          setIsSignIn(true);
        } else {
          setIsSignIn(false);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false); //로딩 완료
    };
    bootstrapAsync();
  }, []);

  console.log("issignin", isSignIn);
  //문제점 : isSignin이 true이면 (유저면) Login 화면이 잠깐 나오고 Tabbar로 감

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
        <Stack.Screen name="Login" component={Login} />
        {isSignIn == true ? (
          <>
            <Stack.Screen name="Tabbar" component={Tabbar} />
          </>
        ) : (
          <>
            <Stack.Screen name="InfoScreen" component={InfoScreen} />
            <Stack.Screen name="Tabbar" component={Tabbar} />
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
