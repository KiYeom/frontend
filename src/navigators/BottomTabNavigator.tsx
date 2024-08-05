import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../components/pages/HomePage/Home';
import Setting from '../components/pages/SettingPage/Setting';
import palette from '../assets/styles/theme';
import HomeIcon from '../assets/icons/Home.svg';
import SettingIcon from '../assets/icons/Setting.svg';
import MyTabBar from '../components/bottom/bottom';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC<any> = ({ isSignIn, setIsSignIn }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#58C3A5' }, //상단 탭 바
        tabBarStyle: { backgroundColor: '#F0F3F8' }, //하단 탭 바
        headerTintColor: '#fff', // 헤더 텍스트 색상
        headerTitleStyle: {
          fontFamily: 'Pretendard-Bold', // 사용할 폰트 패밀리
          fontSize: 17, // 폰트 크기
          color: '#fff', //헤더 폰트 색상
        },
        tabBarActiveTintColor: palette.primary[500], //tab bar focuse 색상
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#58C3A5' }, //상단 탭 바
          headerTintColor: '#fff', // 헤더 텍스트 색상
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold', // 사용할 폰트 패밀리
            fontSize: 17, // 폰트 크기
          },
          tabBarLabel: '홈', //탭 바 아래에 보일 이름
          tabBarIcon: ({ focused }) => (
            <HomeIcon style={{ color: focused ? palette.primary[500] : palette.neutral[300] }} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: true,
          tabBarLabel: '설정',
          headerTintColor: '#fff',
          tabBarIcon: ({ focused }) => (
            <SettingIcon style={{ color: focused ? palette.primary[500] : palette.neutral[300] }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    color: '#333',
  },
});
export default BottomTabNavigator;
