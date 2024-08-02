import React from 'react';
import { Text, View, Image, TouchableOpacity, Button } from 'react-native';
import { StyleSheet } from 'react-native';
//import Icon from "react-native-vector-icons/MaterialIcons";
import { Switch, Icon, PaperProvider, Portal, Modal } from 'react-native-paper';
import { APP_VERSION } from '../../constants/Constants';
import { Provider } from 'react-native-paper';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import useNicknameState from '../../store/nicknameState';
import useNotificationState from '../../store/notificationState';
import axiosInstance from '../../utils/Api';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import requestPermission from '../../utils/NotificationToken';
import OpenSourceLicense from '../../constants/OpenSourceLicense.json';
import { FlatList } from 'react-native';
import palette from '../../assets/styles/theme';
import { MenuItemProps } from '../../constants/Constants';
import { ListRenderItemInfo } from 'react-native';
import MenuItem from '../molecules/MenuItem';
import { Alert } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const SettingMenus: React.FC<any> = ({ navigation, logoutRequest, deactivateRequest }) => {
  let token;
  //개인정보 처리방침 클릭 시, 처리방침 페이지로 이동
  const handlePrivacyPolicyPress = () => {
    //Linking.openURL('https://autumn-flier-d18.notion.site/29f845b297cd4188ade13c6e0c088b9b?pvs=4');
    navigation.navigate('SettingStackNavigator', { screen: 'PrivacyPolicy' });
  };

  //문의하기 클릭 시, 채널톡 페이지로 이동하기
  const handleAskPress = () => {
    //Linking.openURL('https://forms.gle/f92DzjUBNnU51vET6'); //심사중일 때
    navigation.navigate('SettingStackNavigator', { screen: 'ChannelTalk' });
  };
  //알림설정 토글 상태
  const { isSwitchOn, setIsSwitchOn } = useNotificationState();

  //앱 버전 클릭 시 오픈소스 라이센스로 이동
  const handleOpenSource = () => {
    //navigation.navigate("LicensePage")
    navigation.navigate('SettingStackNavigator', { screen: 'LicensePage' });
  };

  //알림설정 클릭 시, 앱 내의 설정 페이지로
  const handleOpenNotification = () => {
    //Linking.openSettings();
    navigation.navigate('SettingStackNavigator', { screen: 'UserNotifications' });
  };

  const onToggleSwitch = async () => {
    const response = await axiosInstance.patch('/notifications', {
      isAllow: !isSwitchOn,
    });
    if (response) {
      //반환값이 true이면 원하는대로 스위치 값 바꾸기
      setIsSwitchOn(!isSwitchOn);
      console.log('토글 바꾸기 성공');
    } else {
      console.log('토글 바꾸기 실패');
    }
  };

  const MenuItems: MenuItemProps[] = [
    { title: '알림설정', onPress: handleOpenNotification },
    { title: '문의하기', onPress: handleAskPress },
    { title: '개인정보 처리방침', onPress: handlePrivacyPolicyPress },
    { title: '앱 정보', onPress: handleOpenSource },
  ];

  const MenuUserItems: MenuItemProps[] = [
    {
      title: '로그아웃',
      onPress: () =>
        Alert.alert(
          '로그아웃 하시겠습니까?', // 첫번째 text: 타이틀 큰 제목
          '로그인 화면으로 이동합니다', // 두번째 text: 작은 제목
          [
            // 버튼 배열
            {
              text: '아니오', // 버튼 제목
              onPress: () => console.log('아니오 버튼 누름'),
              style: 'cancel',
            },
            { text: '네', onPress: () => logoutRequest() },
          ],
          { cancelable: false } //alert 밖에 눌렀을 때 alert 안 없어지도록
        ),
    },
    {
      title: '회원탈퇴',
      onPress: () =>
        /*Alert.alert(
          '정말 탈퇴하시겠어요?', // 첫번째 text: 타이틀 큰 제목
          '탈퇴 버튼 선택 시, 계정은 삭제되며 복구되지 않습니다', // 두번째 text: 작은 제목
          [
            { text: '취소', onPress: () => console.log('탈퇴 취소함') },
            {
              text: '탈퇴', // 버튼 제목
              onPress: () => deactivateRequest(),
            },
          ],
          { cancelable: false } //alert 밖에 눌렀을 때 alert 안 없어지도록
        ),*/
        {
          console.log('회원탈퇴 누름');
          navigation.navigate('SettingStackNavigator', {
            screen: 'DeactivateAlert',
            params: { deactivateRequest },
          });
        },
    },
  ];

  return (
    <View style={styles.container}>
      {MenuItems.map((item, index) => (
        <MenuItem key={index} title={item.title} onPress={item.onPress} />
      ))}
      <Text style={{ color: palette.primary[500] }}>계정관리</Text>
      {MenuUserItems.map((item, index) => (
        <MenuItem key={index} title={item.title} onPress={item.onPress} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default SettingMenus;
