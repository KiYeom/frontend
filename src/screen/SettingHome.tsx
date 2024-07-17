import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Setting from './Setting';
import LicensePage from './LicensePage';
import LicenseDetailPage from './LicenseDetailPage';

const Stack = createNativeStackNavigator();

const SettingHome = () => {
  console.log("settingHome");
  return (
    <Stack.Navigator 
      initialRouteName = "Setting" 
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#58C3A5" }, //상단 탭 바
        headerTintColor: "#fff", // 헤더 텍스트 색상
        headerTitleStyle: {
          fontFamily: "Pretendard-Bold", // 사용할 폰트 패밀리
          fontSize: 17, // 폰트 크기
        },  
      }}>
      <Stack.Screen
        name="Setting"
        component={Setting}
      />
      <Stack.Screen 
        name="LicensePage" 
        component={LicensePage}
        options = {{
          headerTitle : "License",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#58C3A5" }, //상단 탭 바
          headerTintColor: "#fff", // 헤더 텍스트 색상
          headerTitleStyle: {
            fontFamily: "Pretendard-Bold", // 사용할 폰트 패밀리
            fontSize: 17, // 폰트 크기
          },
        }}
      />
      <Stack.Screen 
        name="LicenseDetailPage"
        component={LicenseDetailPage} 
        options = {{
          headerTitle : "Detail"
        }}
      />
    </Stack.Navigator>
  );
};
export default SettingHome

