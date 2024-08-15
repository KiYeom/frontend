import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import palette from '../assets/styles/theme';
import BottomTabBar from '../components/bottom/bottom-tab-bar';
import { TabBarLabel, TabScreenName } from '../constants/Constants';
import StatisticStackNavigator from './StatisticStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import SettingStackNavigator from './SettingStackNavigator';
import PeriodStatisticPage from '../components/pages/StatisticPage/PeriodStatisticPage';
import StatisticMain from '../components/pages/StatisticPage/StatisticMain';
import Home from '../components/pages/HomePage/Home';
import Setting from '../components/pages/SettingPage/Setting';
import { StatisticStackName } from '../constants/Constants';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC<any> = () => {
  //console.log('채팅 화면 새로 그려짐..');
  return (
    <Tab.Navigator
      initialRouteName={TabScreenName.Home}
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary[500], //tab bar focuse 색상
      }}
      detachInactiveScreens={false}>
      <Tab.Screen
        name={TabScreenName.Statistic}
        component={StatisticStackNavigator}
        options={{
          tabBarLabel: TabBarLabel.Statistic,
        }}
      />
      <Tab.Screen
        name={TabScreenName.Home}
        component={Home}
        options={{
          tabBarLabel: TabBarLabel.Home, //탭 바 아래에 보일 이름
        }}
      />
      <Tab.Screen
        name={TabScreenName.Setting}
        component={Setting}
        options={{
          tabBarLabel: TabBarLabel.Setting,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
