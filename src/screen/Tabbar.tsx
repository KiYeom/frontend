import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Chat from "./Chat";
import Home from "./Home";
import Setting from "./Setting";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const Tabbar: React.FC<any> = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#58C3A5" }, //상단 탭 바
        tabBarStyle: { backgroundColor: "#F0F3F8" }, //하단 탭 바
        headerTintColor: "#fff", // 헤더 텍스트 색상
        headerTitleStyle: {
          fontFamily: "Pretendard-Bold", // 사용할 폰트 패밀리
          fontSize: 17, // 폰트 크기
        },
      }}
    >
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
});
export default Tabbar;
