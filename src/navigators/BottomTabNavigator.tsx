import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import palette from '../assets/styles/theme';
import BottomTabBar from '../components/bottom/bottom-tab-bar';
import Home from '../components/pages/HomePage/Home';
import Setting from '../components/pages/SettingPage/Setting';
import { TabBarLabel, TabScreenName } from '../constants/Constants';
import StatisticStackNavigator from './StatisticStackNavigator';
import NewChat from '../components/pages/HomePage/new-chat';
const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC<any> = () => {
  //console.log('채팅 화면 새로 그려짐..');
  return (
    <Tab.Navigator
      initialRouteName={TabScreenName.Home}
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: palette.primary[500], //tab bar focuse 색상
      }}
      detachInactiveScreens={false}>
      <Tab.Screen
        name={TabScreenName.Statistic}
        component={StatisticStackNavigator}
        options={{
          tabBarLabel: TabBarLabel.Statistic,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={TabScreenName.Home}
        component={Home}
        options={{
          tabBarLabel: TabBarLabel.Home, //탭 바 아래에 보일 이름
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={TabScreenName.Chat}
        component={NewChat}
        options={{
          tabBarLabel: TabBarLabel.Chat, //탭 바 아래에 보일 이름
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
