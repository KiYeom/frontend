import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/header';
import ChatList from '../components/pages/HomePage/ChatList';
import SmallEmotionChart from '../components/pages/HomePage/SmallEmotionChart';
import Profile from '../components/pages/Profile/profile';
import { HomeStackName, RootStackName, TabScreenName } from '../constants/Constants';
import NewChat from '../components/pages/HomePage/new-chat';
import Chat from '../components/pages/HomePage/Chat';
import DailyDairy from '../components/pages/HomePage/DailyDairy';
import { formatDate } from '../utils/Chatting';
import { Alert } from 'react-native';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: React.FC = () => {
  const navigation = useNavigation();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={HomeStackName.Chat}
        component={Chat}
        options={{
          header: () => <Header title="쿠키의 채팅방" />,
        }}
      />
      <HomeStack.Screen
        name={HomeStackName.SmallEmotionChart}
        component={SmallEmotionChart}
        options={{
          header: () => (
            <Header
              leftFunction={() =>
                navigation.navigate(RootStackName.BottomTabNavigator, {
                  screen: TabScreenName.Home,
                })
              }
              title={formatDate(new Date()).slice(5)}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={HomeStackName.DailyDairy}
        component={DailyDairy}
        options={{
          header: () => (
            <Header
              title={formatDate(new Date()).slice(5)}
              leftFunction={() => {
                Alert.alert(
                  '뒤로 가시겠어요?', // 첫번째 text: 타이틀 큰 제목
                  '작성한 내용이 지워질 수 있어요!', // 두번째 text: 작은 제목
                  [
                    {
                      text: '아니오',
                      onPress: () => {
                        //Analytics.clickWithdrawalModalCancelButton();
                        console.log('뒤로 가기 방지');
                      },
                    },
                    {
                      text: '네', // 버튼 제목
                      onPress: () => {
                        console.log('뒤로 가기');
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
          ),
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
        name={HomeStackName.NewChatRefresh}
        component={NewChat}
        options={{ headerShown: false, animation: 'none' }}
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
