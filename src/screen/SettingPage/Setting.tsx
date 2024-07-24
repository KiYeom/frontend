import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_KEY } from '../../../utils/storageUtils';
import { ACCESSTOKEN, CHATLOG, REFRESHTOKEN, USER } from '../../constants/Constants';
import { Provider, Button, TextInput } from 'react-native-paper';
import { storage } from '../../../utils/storageUtils';
import { Switch } from 'react-native-paper';
import useNotificationState from '../../store/notificationState';
interface UserInfo {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import UserSetting from '../../components/UserSetting';
import { PaperProvider, Portal, Modal, IconButton, Dialog } from 'react-native-paper';
import { useState } from 'react';
import axiosInstance from '../../model/Chatting';
import useIsSignInState from '../../store/signInStatus';
import useNicknameState from '../../store/nicknameState';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Setting: React.FC<any> = ({ navigation }) => {
  const { navigate } = useNavigation();
  const [visible, setVisible] = useState(false);
  const [modaltext, setModaltext] = useState('');
  const [modalMode, setModalMode] = useState('');
  const [inputText, setInputText] = useState('');
  const { isSignIn, setIsSignIn } = useIsSignInState();
  const { nickname, setNickname } = useNicknameState();
  const { isSwitchOn, setIsSwitchOn } = useNotificationState();

  //로그아웃
  const logoutRequest = async () => {
    console.log('logout Request 시작'); // 로그 추가
    //Google객체를 사용하려면 반드시 configure 메서드를 호출해야 한다.
    GoogleSignin.configure({
      iosClientId: '94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com',
    });
    try {
      console.log('Google 로그아웃 시도'); // 로그 추가
      await GoogleSignin.signOut(); //계정 로그아웃
      console.log('계정 로그아웃 완료'); // 로그 추가

      console.log('서버 로그아웃 시도'); // 로그 추가
      const response = await axiosInstance.delete('/auth/logout', {
        data: {
          deviceId: USER.DEVICEID,
        },
      });
      setIsSignIn(false);
      console.log('서버 로그아웃 응답: '); // 로그 추가
      storage.delete(ACCESSTOKEN);
      storage.delete(REFRESHTOKEN);
      storage.delete(CHATLOG);
      navigation.navigate('Login');
    } catch (error: any) {
      console.log('logoutRequest 요청 실패', error);
      setIsSignIn(true);
      console.log('로그아웃 실패 json', error);
    }
  };
  //회원 탈퇴
  const deactivateRequest = async () => {
    console.log('deactivate Request 시작');
    try {
      const response = await axiosInstance.delete('/auth/deactivate');
      console.log('서버 회원탈퇴 응답 : ');
      setIsSignIn(false);
      navigation.navigate('Login');
      storage.delete(ACCESSTOKEN);
      storage.delete(REFRESHTOKEN);
      storage.delete(CHATLOG);
    } catch (error: any) {
      console.log('deactivateRequest 요청 실패', error);
      console.log('회원탈퇴 안 됨 json', error);
      setIsSignIn(true);
    }
  };
  //유저 별명 변경
  const nicknameRequest = async () => {
    console.log('nickname Request 시작');
    USER.NICKNAME = inputText;
    setNickname(inputText);
    console.log('USER의 nickname (USER.NICKNAME) : ', USER.NICKNAME);
    console.log('USER의 nickname (inputText) : ', inputText);
    try {
      const response = await axiosInstance.patch('/users/nickname', {
        nickname: inputText,
      });
      console.log('서버 닉네임 응답');
      USER.NICKNAME = inputText;
    } catch (error) {
      console.log('nicknameRequest 요청 실패', error);
    }
  };

  //유저 정보 가져오기
  const userInfo = async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      console.log('유저 정보 가져오기 성공', response);
      USER.NICKNAME = response.data.data.nickname;
      setNickname(response.data.data.nickname);
    } catch (error) {
      console.log('유저 정보 가져오기 실패', error);
    }
  };

  //알림 설정 확인하기 -> 서버에서 유저의 알림 정보를 가져오고
  //가져온 대로 토글의 위치를 바꾼다.
  const setNotification = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      setIsSwitchOn(response.data.data.isAllow);
      console.log('서버에서 알림 설정 가져오기', response.data.data.isAllow);
      return;
    } catch (error) {
      console.log('알림 설정 확인하기 실패');
      return false;
    }
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
    console.log('설정화면');
    setNotification();
    console.log('서버에 저장된 값 : ', isSwitchOn);
  }, []);

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
                defaultValue={USER.NICKNAME}
                onChangeText={inputText => setInputText(inputText)}
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
          <Text>닉네임</Text>
          <View style={styles.userName}>
            <Text style={styles.userInfoText}>{USER.NICKNAME}</Text>
            <IconButton
              icon="pencil"
              iconColor="black"
              size={20}
              onPress={() => showModal('nickname')}
            />
          </View>
        </View>
        <UserSetting navigation={navigation} showModal={showModal} />
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
