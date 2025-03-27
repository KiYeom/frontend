import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/header';
//import ChatList from '../components/pages/HomePage/ChatList';
import SmallEmotionChart from '../pages/HomePage/diary/SmallEmotionChart';
import Profile from '../pages/HomePage/Profile/profile';
import { HomeStackName, RootStackName, TabScreenName } from '../constants/Constants';
import NewChat from '../pages/HomePage/chat/new-chat';
//import Chat from '../components/pages/HomePage/Chat';
import DailyDairy from '../pages/HomePage/diary/DailyDairy';
//import { formatDate } from '../utils/Chatting';
import { Alert } from 'react-native';
import DrawerNavigator from './DrawerNavigator';

import StatisticMain from '../pages/StatisticPage/StatisticMain';
import Home from '../pages/HomePage/Home';
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: React.FC = () => {
  const navigation = useNavigation();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={HomeStackName.SmallEmotionChart}
        component={SmallEmotionChart}
        //initialParams={{ date: new Date().toISOString() }}
        //options={({ route, navigation }) => ({
        //header: () => <Header />,
        //})}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name={HomeStackName.DailyDairy}
        component={DailyDairy}
        //initialParams={{ date: new Date() }}
        //options={({ route, navigation }) => ({
        //header: () => <Header />,
        //})}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name={HomeStackName.Profile}
        component={Profile}
        options={{ header: () => <Header /> }}
        //options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name={HomeStackName.NewChat}
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name={HomeStackName.NewChatRefresh}
        component={DrawerNavigator}
        options={{ headerShown: false, animation: 'none' }}
      />
      {/* 1.5.7 UPDATE 일일보고서 추가 */}
      <HomeStack.Screen
        name={HomeStackName.Report}
        component={StatisticMain}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigator;

/*header: () => (
            <Header
              title={
                route.params?.date
                  ? new Date(route.params.date).toLocaleDateString()
                  : 'Default Title'
              }
              leftFunction={() => {
                Alert.alert(
                  '뒤로 가시겠어요?', // 첫번째 text: 타이틀 큰 제목
                  '작성한 내용이 지워질 수 있어요!', // 두번째 text: 작은 제목
                  [
                    {
                      text: '아니오',
                      onPress: () => {
                        //Analytics.clickWithdrawalModalCancelButton();
                        //console.log('뒤로 가기 방지');
                      },
                    },
                    {
                      text: '네', // 버튼 제목
                      onPress: () => {
                        //console.log('뒤로 가기');
                        navigation.navigate(RootStackName.HomeStackNavigator, {
                          screen: HomeStackName.SmallEmotionChart,
                        });
                      },
                    },
                  ],
                  { cancelable: false }, //alert 밖에 눌렀을 때 alert 안 없어지도록
                );
              }}
            />
          ),*/

/*
<Header
              leftFunction={() =>
                navigation.navigate(RootStackName.BottomTabNavigator, {
                  screen: TabScreenName.Home,
                })
              }
              title={
                route.params?.date
                  ? new Date(route.params.date).toLocaleDateString()
                  : 'Default Title'
              }
            />*/
