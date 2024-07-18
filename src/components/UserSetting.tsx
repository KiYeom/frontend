import React from "react";
import { Text, View, Image, TouchableOpacity, Button } from "react-native";
import { StyleSheet } from "react-native";
//import Icon from "react-native-vector-icons/MaterialIcons";
import { Switch, Icon, PaperProvider, Portal, Modal } from 'react-native-paper';
import { APP_VERSION } from "../constants/Constants";
import { Provider } from "react-native-paper";
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import useNicknameState from "../store/nicknameState";
import useNotificationState from "../store/notificationState";
import axiosInstance from "../model/Chatting";
import * as Notifications from 'expo-notifications';
import { Platform } from "react-native";
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import requestPermission from "./NotificationToken";
import OpenSourceLicense from "../constants/OpenSourceLicense.json"
import { FlatList } from "react-native";
import LicensePage from "../screen/LicensePage";




Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const UserSetting: React.FC<any> = ({navigation, showModal}) => {
  let token;
  //개인정보 페이지 이동하기
  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://autumn-flier-d18.notion.site/29f845b297cd4188ade13c6e0c088b9b?pvs=4');
  }
  const handleAskPress = () => {
    Linking.openURL('https://forms.gle/f92DzjUBNnU51vET6');
  }
  const {isSwitchOn, setIsSwitchOn} = useNotificationState();
  const handleOpenSource = () => {
    navigation.navigate("LicensePage")
  }
  const handleOpenNotification = () => {
    Linking.openSettings();
  }


  const onToggleSwitch = async () => {
    const response = await axiosInstance.patch('/notifications', {
      isAllow : !isSwitchOn
    });
    if (response) { //반환값이 true이면 원하는대로 스위치 값 바꾸기
      setIsSwitchOn(!isSwitchOn);
      console.log("토글 바꾸기 성공");
    }
    else {
      console.log("토글 바꾸기 실패");
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style = {styles.titleContainer} onPress = {handleOpenNotification}>
        <Text style = {styles.text}>알림설정</Text>
        <Icon
          source="chevron-right"
          size={32}
          color="#3B506B"
        />
      </TouchableOpacity>

      <TouchableOpacity style = {styles.titleContainer} onPress = {handleAskPress}>
        <Text style = {styles.text}>문의하기</Text>
        <Icon
          source="chevron-right"
          size={32}
          color="#3B506B"
        />
      </TouchableOpacity>

      <TouchableOpacity style = {styles.titleContainer} onPress = {handlePrivacyPolicyPress}>
        <Text style = {styles.text}>개인정보 처리방침</Text>
        <Icon
          source="chevron-right"
          size={32}
          color="#3B506B"
        />
      </TouchableOpacity>
      
        <TouchableOpacity style = {styles.titleContainer} onPress = {()=>showModal("logout")}>
          <Text style = {styles.text}>로그아웃</Text>
          <Icon
            source="chevron-right"
            size={32}
            color="#3B506B"
          />
        </TouchableOpacity>
      <TouchableOpacity style = {styles.titleContainer} onPress = {()=>showModal("deactivate")}>
        <Text style = {styles.text}>회원탈퇴</Text>
        <Icon
          source="chevron-right"
          size={32}
          color="#3B506B"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress = {handleOpenSource}>
        <View style = {styles.titleContainer}>
          <Text style = {styles.text}>앱 버전 정보</Text>
          <Text>{APP_VERSION}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  test : {
    width : "100%",
  },
  container : {
    flex : 1,
    //backgroundColor : "red",
    width : "100%",
    height : "100%",
  },
  titleContainer : {
    padding : 16,
    //backgroundColor : "yellow",
    flexDirection : "row",
    borderColor : "f0f3f8",
    justifyContent : "space-between",
    alignItems : "center",
    //borderBottomWidth : 0.3, 
  },
  btnContainer : {
    flexDirection : "row",
    justifyContent : "space-evenly",
    alignContent : "center",
  },
  text : {
    fontSize : 17,
    //padding : 16,
  },
});

export default UserSetting;
