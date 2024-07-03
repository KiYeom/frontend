import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import LogoutButton from "../components/LogoutButton";
import DeleteAccoutButton from "../components/DeleteAccoutButton";
import { useNavigation } from "@react-navigation/native";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { USER } from "../constants/Constants";
interface UserInfo {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import UserInfo from "../components/UserInfo";
import UserSetting from "../components/UserSetting";
import { PaperProvider, Portal, Modal, IconButton } from "react-native-paper";
import { useState } from "react";

const Setting: React.FC<any> = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 50};
  return (
    <PaperProvider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text>Example Modal.  Click outside this area to dismiss.</Text>
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
              onPress={showModal}
            />
          </View>
        </View>
        <UserSetting navigation={navigation} />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo : {
    backgroundColor : "yellow",
    width : "100%",
    padding : 16,
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
});
export default Setting;
