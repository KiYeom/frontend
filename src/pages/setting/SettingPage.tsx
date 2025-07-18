import * as Notifications from 'expo-notifications';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Alert, View, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLatestVersion, logout } from '../../apis/setting';
import palette from '../../assets/styles/theme';
import { CHATLOG, RootStackName, SettingStackName } from '../../constants/Constants';
import Analytics from '../../utils/analytics';
import { getAppVersion } from '../../utils/device-info';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import { UseSigninStatus } from '../../utils/signin-status';
import {
  clearInfoWhenLogout,
  getDeviceIdFromMMKV,
  getUserNickname,
  storage,
} from '../../utils/storageUtils';
import Icon from '../../components/icons/icons';
import MenuRow from '../../components/menu-row/MenuRow';
import {
  AppSettingContainer,
  ProfileImage,
  SettingContainer,
  SubjectText,
  SubjectTextContainer,
  UserInfoContainer,
  UserNickname,
  UserSettingContainer,
} from './SettingPage.style';

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
    try {
      const deviceId = getDeviceIdFromMMKV();
      if (deviceId) await logout(deviceId);
      else await logout('');
      clearInfoWhenLogout();
      //storage.delete(CHATLOG);
      //console.log('[Setting - Logout Button] LogOut: 1, SigninStatus: ', SigninStatus);
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
          onPress: () => {
            Analytics.clickTabSettingLogoutCancelButton();
          },
        },
        {
          text: '네',
          onPress: () => {
            Analytics.clickTabSettingLogoutConfirmButton();
            logoutRequest();
          },
        },
      ],
      { cancelable: false }, //alert 밖에 눌렀을 때 alert 안 없어지도록
    );
  };

  useEffect(() => {
    Analytics.watchTabSettingScreen();
  }, []);

  useEffect(() => {
    setLoading(true);
    getLatestVersion()
      .then((res) => {
        const deviceVersion = getAppVersion() ?? undefined; //사용자가 사용중인 앱 버전을 가지고 옴
        if (res && deviceVersion && deviceVersion !== res.latestVersion) {
          setIsLatest(false);
          return;
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    const unsubscribe = navigation.addListener('focus', () => {
      setName(getUserNickname() + '');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
      }}>
      <SettingContainer>
        {/* 유저 정보 수정 */}
        <UserInfoContainer
          activeOpacity={1}
          onPress={() => {
            Analytics.clickTabSettingEditInfoButton();
            navigation.navigate(RootStackName.SettingStackNavigator, {
              screen: SettingStackName.EditUserInfo,
            });
          }}>
          <ProfileImage source={require('../../assets/images/setting_default_profile.png')} />
          <UserNickname>{getUserNickname()}</UserNickname>
          <Icon
            name="arrow-right"
            width={rsWidth * 9}
            height={rsHeight * 18}
            color={palette.neutral[300]}
          />
        </UserInfoContainer>
        {/* 앱 내의 설정*/}
        <AppSettingContainer>
          <MenuRow
            text="알림설정"
            onPress={() => {
              Analytics.clickTabSettingNotificationButton();
              navigation.navigate(RootStackName.SettingStackNavigator, {
                screen: SettingStackName.UserNotifications,
              });
            }}
          />
          <MenuRow
            text="대화방 설정"
            onPress={() => {
              Analytics.clickTabSettingChattingSetting();
              navigation.navigate(RootStackName.SettingStackNavigator, {
                screen: SettingStackName.UserChattingSetting,
              });
            }}
          />
          <MenuRow
            text="문의하기"
            onPress={async () => {
              Analytics.clickTabSettingInquiryButton();
              if (Platform.OS === 'android') {
                await Linking.openURL('https://j2wk7.channel.io/home');
              } else {
                WebBrowser.openBrowserAsync('https://j2wk7.channel.io/home');
              }
            }}
          />
          <MenuRow
            text="서비스 이용약관"
            onPress={() => {
              Analytics.clickTabSettingServiceTermsButton();
              WebBrowser.openBrowserAsync(
                'https://autumn-flier-d18.notion.site/reMIND-167ef1180e2d42b09d019e6d187fccfd',
              );
            }}
          />
          <MenuRow
            text="개인정보 처리방침"
            onPress={() => {
              Analytics.clickTabSettingPrivacyPolicyButton();
              WebBrowser.openBrowserAsync(
                'https://autumn-flier-d18.notion.site/reMIND-167ef1180e2d42b09d019e6d187fccfd',
              );
            }}
          />
          <MenuRow
            text="오픈소스 라이센스"
            onPress={() => {
              Analytics.clickTabSettingOpenSourceButton();
              navigation.navigate(RootStackName.SettingStackNavigator, {
                screen: SettingStackName.LicensePage,
              });
            }}
          />
          <MenuRow text="앱 정보" showVersion={!loading} isLatest={isLatest} />
        </AppSettingContainer>
        {/* 계정 정보 수정 */}
        <UserSettingContainer>
          <SubjectTextContainer>
            <SubjectText>계정 설정</SubjectText>
          </SubjectTextContainer>
          <MenuRow
            text="로그아웃"
            onPress={() => {
              Analytics.clickTabSettingLogoutButton();
              logoutAlert();
            }}
          />
          <MenuRow
            text="회원탈퇴"
            onPress={() => {
              Analytics.clickTabSettingWithdrawalButton();
              navigation.navigate(RootStackName.SettingStackNavigator, {
                screen: SettingStackName.DeactivateAlert,
              });
            }}
          />
        </UserSettingContainer>
      </SettingContainer>
    </View>
  );
};

export default Setting;
