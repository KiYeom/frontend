import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Linking, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import StartButton from '../../components/StartButton';
import Chat from './Chat';
import Setting from '../SettingPage/Setting';
import { useEffect } from 'react';
import useNoticeState from '../../store/notice';
import { PaperProvider, Portal, Modal } from 'react-native-paper';
import requestPermission from '../../utils/NotificationToken';
import { useNavigation } from '@react-navigation/native';

interface Option {
  link: string;
  text: string;
}

const Home: React.FC<any> = ({ navigation }) => {
  //const { notice, setNotice } = useNoticeState();
  //console.log('---------home notice---------', notice);
  //const [visible, setVisible] = React.useState(false);
  //const title = notice ? notice.title : null;
  //const content = notice ? notice.content : null;
  //const btns = notice ? notice.options : null;
  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.txt1}>🐾오늘 몸 상태는 어때?૮ ・ﻌ・ა</Text>
        <StartButton navigation={navigation} />
        <Image
          source={require('../../../assets/cookieSplash.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.txt1}>오늘의 감정 기록</Text>
        <View style={styles.footerContainer}>
          <Text>감정기록박스</Text>
          <Button
            title="감정기록하기"
            onPress={() => navigation.navigate('HomeStackNavigator', { screen: 'MoodChart' })}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 50, // 상단에 약간의 여백 추가
    backgroundColor: 'yellow',
    height: '50%',
    width: '100%',
  },
  //center: {
  //flex: 1,
  //justifyContent: 'center',
  //alignItems: 'center',
  //},
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
