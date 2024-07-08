import React from "react";
import { Text, View, Image, TouchableOpacity, Button } from "react-native";
import { StyleSheet } from "react-native";
//import Icon from "react-native-vector-icons/MaterialIcons";
import DeleteAccoutButton from "./DeleteAccoutButton";
import { Switch, Icon, PaperProvider, Portal, Modal } from 'react-native-paper';
import { APP_VERSION } from "../constants/Constants";
import { Provider } from "react-native-paper";
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
const UserSetting: React.FC<any> = ({navigation, showModal}) => {
  //개인정보 페이지 이동하기
  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://autumn-flier-d18.notion.site/29f845b297cd4188ade13c6e0c088b9b?pvs=4');
  }
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View style={styles.container}>
      <View style = {styles.titleContainer}>
        <Text style = {styles.text}>알림설정</Text>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color = "#3B506B"/>
      </View>

      <TouchableOpacity style = {styles.titleContainer}>
        <Text style = {styles.text}>문의하기</Text>
        <Icon
          source="chevron-right"
          size={32}
        />
      </TouchableOpacity>

      <TouchableOpacity style = {styles.titleContainer} onPress = {handlePrivacyPolicyPress}>
        <Text style = {styles.text}>개인정보 처리방침</Text>
        <Icon
          source="chevron-right"
          size={32}
        />
      </TouchableOpacity>
      
        <TouchableOpacity style = {styles.titleContainer} onPress = {()=>showModal("logout")}>
          <Text style = {styles.text}>로그아웃</Text>
          <Icon
            source="chevron-right"
            size={32}
          />
        </TouchableOpacity>
      <TouchableOpacity style = {styles.titleContainer} onPress = {()=>showModal("deactivate")}>
        <Text style = {styles.text}>회원탈퇴</Text>
        <Icon
          source="chevron-right"
          size={32}
        />
      </TouchableOpacity>
      <View style = {styles.titleContainer}>
        <Text style = {styles.text}>앱 버전 정보</Text>
        <Text>{APP_VERSION}</Text>
      </View>
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
