import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LogoutButton from "../components/LogoutButton";
import DeleteAccoutButton from "../components/DeleteAccoutButton";
import { useNavigation } from "@react-navigation/native";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { USER } from "../constants/Constants";
import { Provider, Button } from "react-native-paper";
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

const Setting: React.FC<any> = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [modaltext, setModaltext] = useState("");
  
  const showModal = (text : string) => {
    setModaltext(text);
    setVisible(true);
  }
  const hideModal = () => setVisible(false);
  const btnClick = () => {
    console.log("모달의 완료 버튼 클릭함");
    hideModal();
  }
  const containerStyle = {backgroundColor: 'white', padding: 20, width : "70%", borderRadius : 20, height : "40%", justifycontent : "center", alignItems: 'center', alignSelf : "center"};
  return (
    <PaperProvider>
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
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
            iconColor="#58C3A5"
            size={20}
            onPress={() => showModal("수정하기 페이지")}
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
  modal: {
    backgroundColor: 'white',
    padding: 30,
    width: 300,
    height : 200,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalTitle : {
    fontSize : 20,
    color : "pink",
  }
});
export default Setting;
