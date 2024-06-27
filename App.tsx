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

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [email, setEmail] = useState(""); //상태관리 컴포넌트 외부가 아닌, "컴포넌트 안에서" 호출되어야 한다.
  const [isUser, setIsUser] = useState(false);
  const [isLogin, setIsLogin] = useState(false); //로그인 여부
  const [route, setRoute] = useState("Login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getData("userID");
      if (user) {
        console.log(
          "기존회원 : 앱 들어오면 자동 로그인 -> 바로 tabbar 화면으로"
        );
        setRoute("tabbar");
        setIsLogin(true);
      } else {
        setRoute("Login");
        console.log("정보가 없으니 로그인 화면 -> 정보 화면으로");
        setIsLogin(false);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ); //로딩중일 때 보여줄 로딩 화면 또는 스피너
  }

  console.log("route : ", route);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {route === "Login" ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <Stack.Screen name="Tabbar" component={Tabbar} />
        )}
        <Stack.Screen name="InfoScreen" component={InfoScreen} />
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
