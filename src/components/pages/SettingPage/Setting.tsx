import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { CHATLOG, RootStackName, SettingStackName } from '../../../constants/Constants';
import SettingMenus from '../../organisms/SettingMenus';
import * as Notifications from 'expo-notifications';
import UserInfomation from '../../molecules/UserInfomation';
import { deavtivate, getLatestVersion, getUserInfo, logout } from '../../../apis/setting';
import {
  clearInfoWhenLogout,
  getDeviceIdFromMMKV,
  getUserNickname,
  setUserInfo,
  storage,
} from '../../../utils/storageUtils';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UseSigninStatus } from '../../../utils/signin-status';
import {
  AppSettingContainer,
  ProfileImage,
  SettingContainer,
  SubjectText,
  SubjectTextContainer,
  UserInfoContainer,
  UserNickname,
  UserSettingContainer,
} from './Setting.style';
import Icon from '../../icons/icons';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import MenuRow from '../../menu-row/menu-row';
import * as Linking from 'expo-linking';
import { getAppVersion } from '../../../utils/device-info';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Setting: React.FC<any> = ({ navigation }) => {
  const [name, setName] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const { SigninStatus, setSigninStatus } = UseSigninStatus();
  const [isLatest, setIsLatest] = React.useState<boolean>(true);
  const insets = useSafeAreaInsets();

  //로그아웃
  const logoutRequest = async () => {
    console.log('logout Request 시작'); // 로그 추가
    try {
      const deviceId = getDeviceIdFromMMKV();
      if (deviceId) await logout(deviceId);
      else await logout('');
      clearInfoWhenLogout();
      storage.delete(CHATLOG);
      console.log('[Setting - Logout Button] LogOut: 1, SigninStatus: ', SigninStatus);
      setSigninStatus(false);
    } catch (error: any) {
      console.error('[ERROR] logoutRequest: ', error);
    }
  };

  const logoutAlert = () => {
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
    );
  };

  useEffect(() => {
    setLoading(true);
    getLatestVersion()
      .then((res) => {
        if (res) {
          if (res.latestVersion === getAppVersion()) {
            setIsLatest(true);
          } else {
            setIsLatest(false);
          }
          setLoading(false);
        } else {
          setIsLatest(true);
        }
      })
      .catch((error) => console.error(error));
    const unsubscribe = navigation.addListener('focus', () => {
      setName(getUserNickname() + '');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <SettingContainer>
      <UserInfoContainer
        insets={insets}
        activeOpacity={1}
        onPress={() =>
          navigation.navigate(RootStackName.SettingStackNavigator, {
            screen: SettingStackName.EditUserInfo,
          })
        }>
        <ProfileImage source={require('../../../assets/images/setting_default_profile.png')} />
        <UserNickname>{getUserNickname()}</UserNickname>
        <Icon
          name="arrow-right"
          width={rsWidth * 9}
          height={rsHeight * 18}
          color={palette.neutral[300]}
        />
      </UserInfoContainer>
      <AppSettingContainer>
        <MenuRow
          text="알림설정"
          onPress={() =>
            navigation.navigate(RootStackName.SettingStackNavigator, {
              screen: SettingStackName.UserNotifications,
            })
          }
        />
        <MenuRow
          text="문의하기"
          onPress={() =>
            // navigation.navigate(RootStackName.SettingStackNavigator, {
            //   screen: SettingStackName.ChannelTalk,
            // })
            Linking.openURL('https://j2wk7.channel.io/home')
          }
        />
        <MenuRow
          text="개인정보 처리방침"
          onPress={() =>
            navigation.navigate(RootStackName.SettingStackNavigator, {
              screen: SettingStackName.PrivacyPolicy,
            })
          }
        />
        <MenuRow
          text="오픈 라이센스"
          onPress={() =>
            navigation.navigate(RootStackName.SettingStackNavigator, {
              screen: SettingStackName.LicensePage,
            })
          }
        />
        <MenuRow text="앱 정보" showVersion={!loading} isLatest={isLatest} />
      </AppSettingContainer>
      <UserSettingContainer>
        <SubjectTextContainer>
          <SubjectText>계정 설정</SubjectText>
        </SubjectTextContainer>
        <MenuRow text="로그아옷" onPress={() => logoutAlert()} />
        <MenuRow
          text="회원탈퇴"
          onPress={() =>
            navigation.navigate(RootStackName.SettingStackNavigator, {
              screen: SettingStackName.DeactivateAlert,
            })
          }
        />
      </UserSettingContainer>
    </SettingContainer>
  );
};

export default Setting;
