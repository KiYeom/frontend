import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/header';
import Chat from '../components/pages/HomePage/Chat';
import ChatList from '../components/pages/HomePage/ChatList';
import SmallEmotionChart from '../components/pages/HomePage/SmallEmotionChart';
import Profile from '../components/pages/Profile/profile';
import { HomeStackName, TabScreenName } from '../constants/Constants';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: React.FC = () => {
  const navigation = useNavigation();
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={HomeStackName.Chat}
        component={Chat}
        options={{
          header: () => (
            <Header
              title="쿠키의 채팅방"
              leftFunction={() => navigation.navigate(TabScreenName.Home)}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={HomeStackName.SmallEmotionChart}
        component={SmallEmotionChart}
        options={{
          header: () => <Header leftFunction={() => navigation.navigate(TabScreenName.Home)} />,
        }}
      />
      <HomeStack.Screen
        name={HomeStackName.Profile}
        component={Profile}
        options={{ header: () => <Header /> }}
      />
      <HomeStack.Screen
        name={HomeStackName.ChatList}
        component={ChatList}
        options={{ header: () => <Header title="채팅 목록" /> }}
      />
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigator;
