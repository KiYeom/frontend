import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Linking, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Chat from './Chat';
import Setting from '../SettingPage/Setting';
import { useEffect } from 'react';
import useNoticeState from '../../../store/notice';
import { PaperProvider, Portal, Modal } from 'react-native-paper';
import requestPermission from '../../../utils/NotificationToken';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPLASH_PATH } from '../../../constants/Constants';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import { HomeContainer } from './Home.style';
const Home: React.FC<any> = ({ navigation }) => {
  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <HomeContainer>
      <HomeChatBtn navigation={navigation} />
    </HomeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
    //alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  header: {
    alignItems: 'center',
    marginTop: 50, // 상단에 약간의 여백 추가
    //backgroundColor: 'yellow',
    height: '50%',
    width: '100%',
  },

  footer: {
    alignItems: 'center',
    marginBottom: 30, // 하단에 약간의 여백 추가
    height: '30%',
    //backgroundColor: 'red',
    width: '100%',
  },
  footerContainer: {
    backgroundColor: 'pink',
    width: '100%',
    height: '100%',
  },
  txt1: {
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
  },
  txt2: {
    fontSize: 24,
  },
  image: {
    width: 200,
    height: 200,
  },
});
export default Home;
