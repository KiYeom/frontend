import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/header';
//import ChatList from '../components/pages/HomePage/ChatList';
import SmallEmotionChart from '../pages/home/diary/SelectEmotionPage/SmallEmotionChart';
import Profile from '../pages/home/Profile/profile';
import { HomeStackName, RootStackName, TabScreenName } from '../constants/Constants';
import NewChat from '../pages/home/chat/new-chat';
//import Chat from '../components/pages/HomePage/Chat';
import DailyDairy from '../pages/home/diary/WriteDiaryPage/DailyDairy';
//import { formatDate } from '../utils/Chatting';
import { Alert } from 'react-native';
import DrawerNavigator from './DrawerNavigator';
import Favorites from '../pages/home/favorites/favorites';
import newFavorites from '../pages/home/favorites/newFavorites';
import StatisticMain from '../pages/StatisticPage/StatisticMain';
import Home from '../pages/home/Home';
import Quote from '../pages/home/quote/quote';
import CallPage from '../pages/CallPage/CallPage';
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: React.FC = () => {
  const navigation = useNavigation();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={HomeStackName.SmallEmotionChart}
        component={SmallEmotionChart}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name={HomeStackName.DailyDairy}
        component={DailyDairy}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name={HomeStackName.Profile}
        component={Profile}
        options={{ header: () => <Header /> }}
      />
      <HomeStack.Screen name={HomeStackName.NewChat} options={{ headerShown: false }}>
        {() => <DrawerNavigator initialScreen="NewChat" />}
      </HomeStack.Screen>
      <HomeStack.Screen
        name={HomeStackName.NewChatRefresh}
        component={DrawerNavigator}
        options={{ headerShown: false, animation: 'none' }}
      />
      <HomeStack.Screen
        name={HomeStackName.Call}
        component={CallPage}
        options={{ headerShown: false, animation: 'none' }}
      />
      {/* 1.5.7 UPDATE 일일보고서 추가 */}
      <HomeStack.Screen
        name={HomeStackName.Report}
        component={StatisticMain}
        options={{ headerShown: false }}
      />
      {/* 1.5.7 UPDATE 즐겨찾기 추가 */}
      <HomeStack.Screen
        name={HomeStackName.Favorites}
        component={Favorites}
        options={{ headerShown: false }}
      />
      {/* 1.8.9 quote 추가 */}
      <HomeStack.Screen
        name={HomeStackName.Quote}
        component={Quote}
        options={{ header: () => <Header /> }}
      />
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigator;
