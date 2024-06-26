//처음 회원가입을 하면 infoscreen으로 가서... 이름, 나이, 성별 물어보기
import React from "react";
import InfoName from "./InfoName";
import InfoAge from "./InfoAge";
import InfoGender from "./InfoGender";
import Tabbar from "./Tabbar";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const InfoScreen: React.FC = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      <Stack.Screen name="InfoName" component={InfoName} />
      <Stack.Screen name="InfoAge" component={InfoAge} />
      <Stack.Screen name="InfoGender" component={InfoGender} />
      <Stack.Screen name="Tabbar" component={Tabbar} />
    </Stack.Navigator>
  );
};
export default InfoScreen;
