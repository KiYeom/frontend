import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/header';
import ChatList from '../components/pages/HomePage/ChatList';
import SmallEmotionChart from '../components/pages/HomePage/SmallEmotionChart';
import Profile from '../components/pages/Profile/profile';
import { HomeStackName, TabScreenName } from '../constants/Constants';
import NewChat from '../components/pages/HomePage/new-chat';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: React.FC = () => {
  const navigation = useNavigation();
  return (
    <HomeStack.Navigator>
      {/*<HomeStack.Screen
        name={HomeStackName.NewChat}
        component={NewChat}
        options={{
          header: () => (
            <Header
              title="쿠키의 채팅방"
              leftFunction={() => navigation.navigate(TabScreenName.Home)}
            />
          ),
        }}
      />*/}
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
        name={HomeStackName.NewChat}
        component={NewChat}
        options={{ headerShown: false }}
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
