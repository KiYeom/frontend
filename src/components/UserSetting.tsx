import React from "react";
import { Text, View, Image } from "react-native";
import { StyleSheet } from "react-native";
//import Icon from "react-native-vector-icons/MaterialIcons";
import LogoutButton from "./LogoutButton";
import DeleteAccoutButton from "./DeleteAccoutButton";

const UserSetting: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style = {styles.titleContainer}>
        <Text style = {styles.text}>알림설정</Text>
      </View>
      <View style = {styles.titleContainer}>
        <Text style = {styles.text}>문의하기</Text>
      </View>
      <View style = {styles.titleContainer}>
        <Text style = {styles.text}>개인정보 처리방침</Text>
      </View>
      <View style = {styles.titleContainer}>
        <Text style = {styles.text}>로그아웃</Text>
      </View>
      <View style = {styles.titleContainer}>
        <Text style = {styles.text}>회원탈퇴</Text>
      </View>
      <View style = {styles.titleContainer}>
        <Text style = {styles.text}>앱 버전 정보</Text>
      </View>
      <View style = {styles.btnContainer}>
        <LogoutButton navigation={navigation} />
        <DeleteAccoutButton navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : "white",
    width : "100%"
  },
  titleContainer : {
    borderColor : "f0f3f8",
    //borderBottomWidth : 0.3, 
  },
  btnContainer : {
    flexDirection : "row",
    justifyContent : "space-evenly",
    alignContent : "center",
  },
  text : {
    fontSize : 17,
    padding : 16,
  },
});

export default UserSetting;
