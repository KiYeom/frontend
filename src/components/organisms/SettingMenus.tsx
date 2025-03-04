/*
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import palette from '../../assets/styles/theme';
import { MenuItemProps } from '../../constants/Constants';
import MenuItem from '../molecules/MenuItem';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const SettingMenus: React.FC<any> = ({ navigation, logoutRequest }) => {
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
              style: 'cancel',
            },
            { text: '네', onPress: () => logoutRequest() },
          ],
          { cancelable: false }, //alert 밖에 눌렀을 때 alert 안 없어지도록
        ),
    },
    {
      title: '회원탈퇴',
      onPress: () => {
        navigation.navigate('SettingStackNavigator', {
          screen: 'DeactivateAlert',
          params: {},
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
*/
