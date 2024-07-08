import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DeleteAccoutButton from "../components/DeleteAccoutButton";
import { useNavigation } from "@react-navigation/native";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { ACCESSTOKEN, REFRESHTOKEN, USER } from "../constants/Constants";
import { Provider, Button } from "react-native-paper";
import { storage } from "../../utils/storageUtils";
import { Switch } from 'react-native-paper';
interface UserInfo {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import UserInfo from "../components/UserInfo";
import UserSetting from "../components/UserSetting";
import { PaperProvider, Portal, Modal, IconButton, Dialog } from "react-native-paper";
import { useState } from "react";
import axiosInstance from "../model/Chatting";

const Setting: React.FC<any> = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [modaltext, setModaltext] = useState("");

  const logoutRequest = async () => {
    console.log("logout Request 시작"); // 로그 추가
    //Google객체를 사용하려면 반드시 configure 메서드를 호출해야 한다.
    GoogleSignin.configure({
      iosClientId:
        "94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com",
    });
    try {
      console.log("Google 로그아웃 시도"); // 로그 추가
      await GoogleSignin.signOut(); //계정 로그아웃
      console.log("계정 로그아웃 완료"); // 로그 추가
  
      console.log("서버 로그아웃 시도"); // 로그 추가
      const response = await axiosInstance.delete('/api/v1/auth/logout', {
        data: {
          deviceId: USER.DEVICEID,
        }
      });
      console.log("서버 로그아웃 응답: "); // 로그 추가
      navigation.navigate("Login");
    } catch (error) {
      console.log("logoutRequest 요청 실패", error);
    }
  }

  const deactivateRequest = async () => {
    console.log("deactivate Request 시작");
    try {
      const response = await axiosInstance.delete('/api/v1/auth/deactivate');
      console.log("서버 회원탈퇴 응답 : ");
      navigation.navigate("Login");
      storage.delete(ACCESSTOKEN);
      storage.delete(REFRESHTOKEN);
    }
    catch(error) {
      console.log("deactivateRequest 요청 실패", error);
    }
  }

  
  
  const showModal = (text : string) => {
    setModaltext(text); //text : nickname, logout, deactivate
    setVisible(true);
  }
  const hideModal = () => setVisible(false);
  const btnClick = () => {
    console.log("모달의 완료 버튼 클릭함");
    console.log("모달에 적혀있는 글자", modaltext);
    if (modaltext === "nickname") {
      console.log("유저는 닉네임을 변경하기를 원합니다.");
    }
    else if (modaltext === "logout") {
      console.log("유저는 로그아웃을 하기를 원합니다.");
      logoutRequest();
    }
    else if (modaltext === "deactivate") {
      console.log("유저는 회원 탈퇴를 하기를 원합니다.");
      deactivateRequest();
    }
    hideModal();
  }
  return (
    <PaperProvider>
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} style={styles.containerStyle}>
        <Text>{modaltext}</Text>
        <Button mode = "contained" onPress = {btnClick}>완료</Button>
      </Modal>
    </Portal>

    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text>닉네임</Text>
        <View style = {styles.userName}>
          <Text style={styles.userInfoText}>{USER.NICKNAME}</Text>
          <IconButton
            icon="pencil"
            iconColor="black"
            size={20}
            onPress={() => showModal("nickname")}
          />
        </View>
      </View>
      <UserSetting navigation={navigation} showModal = {showModal}/>
    </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo : {
    ///backgroundColor : "yellow",
    width : "100%",
    padding : 16,
    borderColor : "f0f3f8",
    borderBottomWidth : 0.3,
  },
  userName : {
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "flex-start",
  },
  text: {
    fontSize: 24,
    color: "blue",
  },
  userInfoText: {
    color: "black",
    fontSize: 20,
  },
  modalTitle : {
    fontSize : 20,
    color : "pink",
  },
  containerStyle : {
    backgroundColor: 'white', 
    //padding: 20, 
    width : "70%", 
    borderRadius : 30,
    height : "40%", 
    justifyContent : "center", 
    alignItems: 'center', 
    //alignSelf : "center",
  },
});
export default Setting;
