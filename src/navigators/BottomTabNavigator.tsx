import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import palette from '../assets/styles/theme';
import BottomTabBar from '../components/bottom/BottomTabBar';
import Home from '../pages/home/HomePage';
import Setting from '../pages/setting/SettingPage';
import { HomeStackName, TabBarLabel, TabScreenName } from '../constants/Constants';
import StatisticStackNavigator from './StatisticStackNavigator';
import NewChat from '../pages/home/chat/NewChatPage';
import CallPage from '../pages/voice/VoicePage';
const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC<any> = () => {
  return (
    <Tab.Navigator
      initialRouteName={TabScreenName.Home}
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: palette.primary[500], //tab bar focuse 색상
      }}
      detachInactiveScreens={false}>
      {/* 탭 바 순서 : 홈 - 채팅 - 전화 - 보고서 - 설정 */}
      <Tab.Screen
        name={TabScreenName.Home}
        component={Home}
        options={{
          tabBarLabel: TabBarLabel.Home, //탭 바 아래에 보일 이름
          headerShown: false,
        }}
      />

      <Tab.Screen
        name={TabScreenName.NewChat}
        component={NewChat}
        options={{
          tabBarLabel: TabBarLabel.NewChat, //탭 바 아래에 보일 이름
          headerShown: false,
        }}
      />

      <Tab.Screen
        name={TabScreenName.Call}
        component={CallPage}
        options={{
          tabBarLabel: TabBarLabel.Call,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name={TabScreenName.Statistic}
        component={StatisticStackNavigator}
        options={{
          tabBarLabel: TabBarLabel.Statistic,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name={TabScreenName.Setting}
        component={Setting}
        options={{
          tabBarLabel: TabBarLabel.Setting,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
