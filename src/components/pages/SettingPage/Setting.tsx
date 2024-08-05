import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { CHATLOG } from '../../../constants/Constants';
import { Button, TextInput } from 'react-native-paper';
import SettingMenus from '../../organisms/SettingMenus';
import { PaperProvider, Portal, Modal } from 'react-native-paper';
import { useState } from 'react';
import useIsSignInState from '../../../utils/signInStatus';
import * as Notifications from 'expo-notifications';
import UserInfomation from '../../molecules/UserInfomation';
import { changeNickname, deavtivate, getUserInfo, logout } from '../../../apis/setting';
import {
  clearInfoWhenLogout,
  getDeviceIdFromMMKV,
  getUserNickname,
  storage,
} from '../../../utils/storageUtils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Setting: React.FC<any> = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [modaltext, setModaltext] = useState('');
  const [modalMode, setModalMode] = useState('');
  const [inputText, setInputText] = useState('');
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

  //유저 별명 변경
  const nicknameRequest = async () => {
    const res = await changeNickname(inputText);
    if (res?.result) {
      USER.NICKNAME = inputText;
      setNickname(inputText);
    }
  };

  //유저 정보 가져오기
  const userInfo = async () => {
    const response = await getUserInfo();
    if (!response) {
      console.log('유저 정보 가져오기 실패');
      return;
    }
    USER.NICKNAME = response?.nickname || '';
    USER.BIRTHDATE = response?.birthdate || '';
    USER.GENDER = response?.gender === '남성' ? 1 : 2;
    setNickname(USER.NICKNAME);
  };

  //모달창이 열리는 경우
  const showModal = (text: string) => {
    //setModaltext(text); //text : nickname, logout, deactivate
    setModalMode(text); //어떤 모달이 열릴 것인지를 mode로
    let message = '';
    if (text === 'nickname') {
      //console.log("유저는 닉네임을 변경하기를 원합니다.");
      message = '새 닉네임을 입력해주세요.';
      setModaltext(message);
    } else if (text === 'logout') {
      //console.log("유저는 로그아웃을 하기를 원합니다.");
      message = '로그아웃하시겠어요?';
      setModaltext(message);
    } else if (text === 'deactivate') {
      //console.log("유저는 회원 탈퇴를 하기를 원합니다.");
      message = '탈퇴하시겠어요?\n모든 정보가 삭제되며 되돌릴 수 없습니다.';
      setModaltext(message);
    }
    setVisible(true);
  };

  const hideModal = () => setVisible(false);
  //모달창에서 완료 버튼을 클릭한 경우

  const btnClick = () => {
    console.log('모달의 완료 버튼 클릭함');
    if (modalMode === 'nickname') {
      console.log('유저는 닉네임을 변경하기를 원합니다.');
      nicknameRequest();
    } else if (modalMode === 'logout') {
      console.log('유저는 로그아웃을 하기를 원합니다.');
      logoutRequest();
    } else if (modalMode === 'deactivate') {
      console.log('유저는 회원 탈퇴를 하기를 원합니다.');
      deactivateRequest();
    }
    hideModal();
  };

  useEffect(() => {
    userInfo();
  }, []);

  console.log('설정화면 클릭함');

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <View>
            <Text style={styles.modalText}>{modaltext}</Text>
          </View>
          {modalMode === 'nickname' ? (
            <View style={styles.nickNameInput}>
              <TextInput
                label="닉네임"
                defaultValue={getUserNickname()}
                onChangeText={(inputText) => setInputText(inputText)}
                style={styles.inputText}
              />
            </View>
          ) : null}
          <View style={styles.modalBtnContainer}>
            <Button mode="contained" onPress={btnClick}>
              완료
            </Button>
            <Button mode="contained" onPress={hideModal}>
              취소
            </Button>
          </View>
        </Modal>
      </Portal>

      <View style={styles.container}>
        <View style={styles.userInfo}>
          <UserInfomation navigation={navigation} />
        </View>
        <SettingMenus
          navigation={navigation}
          logoutRequest={logoutRequest}
          deactivateRequest={deactivateRequest}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
