import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { CHATLOG } from '../../../constants/Constants';
import SettingMenus from '../../organisms/SettingMenus';
import useIsSignInState from '../../../utils/signInStatus';
import * as Notifications from 'expo-notifications';
import UserInfomation from '../../molecules/UserInfomation';
import { deavtivate, getUserInfo, logout } from '../../../apis/setting';
import {
  clearInfoWhenLogout,
  getDeviceIdFromMMKV,
  setUserInfo,
  storage,
} from '../../../utils/storageUtils';
import { SafeAreaView } from 'react-native-safe-area-context';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Setting: React.FC<any> = ({ navigation }) => {
  const { setIsSignIn } = useIsSignInState();

  //로그아웃
  const logoutRequest = async () => {
    console.log('logout Request 시작'); // 로그 추가
    try {
      const deviceId = getDeviceIdFromMMKV();
      if (deviceId) await logout(deviceId);
      else await logout('');
      clearInfoWhenLogout();
      storage.delete(CHATLOG);
      setIsSignIn(false);
    } catch (error: any) {
      console.error('[ERROR] logoutRequest: ', error);
    }
  };

  //회원 탈퇴
  const deactivateRequest = async (reasons: string[]) => {
    const response = await deavtivate(reasons);
    if (!response || !response.result) {
      alert('회원 탈퇴가 실패했습니다. 다시 시도해주세요.');
      return;
    }
    clearInfoWhenLogout();
    storage.delete(CHATLOG);
    setIsSignIn(false);
  };

  //유저 정보 가져오기
  const userInfo = async () => {
    const res = await getUserInfo();
    if (!res) {
      console.log('유저 정보 가져오기 실패');
      return;
    }
    setUserInfo(res.nickname, res.birthdate, res.gender);
  };

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        <UserInfomation navigation={navigation} />
      </View>
      <SettingMenus
        navigation={navigation}
        logoutRequest={logoutRequest}
        deactivateRequest={deactivateRequest}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //    alignItems: 'center',
    //  justifyContent: 'center',
  },
  userInfo: {
    ///backgroundColor : "yellow",
    width: '100%',
    padding: 16,
    borderColor: 'f0f3f8',
    borderBottomWidth: 0.3,
  },
  userName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 24,
    color: 'blue',
  },
  userInfoText: {
    color: 'black',
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: 'pink',
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    width: '70%',
    borderRadius: 30,
    //height : "30%",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalBtnContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  modalText: {
    fontSize: 17,
    //fontWeight : "bold",
    padding: 15,
  },
  nickNameInput: {
    width: '100%',
    padding: 16,
  },
  inputText: {
    fontWeight: 'normal',
  },
});
export default Setting;
