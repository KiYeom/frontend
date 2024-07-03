import { View, StyleSheet } from "react-native";
import React from "react";
import { useState } from "react";
import { Modal, Portal, Text, Button, PaperProvider, IconButton } from 'react-native-paper';
import { USER } from "../constants/Constants";

const Chat: React.FC = () => {
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
        <Text>닉네임</Text>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>{USER.NICKNAME}</Text>
          <IconButton
            icon="pencil"
            iconColor="#58C3A5"
            size={20}
            onPress={showModal}
          />
        </View>
    </View> 
    </PaperProvider>
    );
};

const styles = StyleSheet.create({
  container: {
    height : 200,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
  imgContainer: {
    flex: 1,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    //backgroundColor: "blue",
    width : "100%",
    flexDirection : "row",
    justifyContent: "flex-start",
    alignItems:"center",
  },
  userInfoText: {
    color: "black",
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
export default Chat;
