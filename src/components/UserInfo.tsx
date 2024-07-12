import React from "react";
import { Text, View, Image } from "react-native";
import { StyleSheet } from "react-native";
//import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { USER } from "../constants/Constants";
import { Button } from "react-native-paper";
import { IconButton, MD3Colors } from 'react-native-paper';
import NameModal from "./NameModal";
import { Modal, Portal, PaperProvider } from 'react-native-paper';
import useNicknameState from "../store/nicknameState";

const UserInfo: React.FC<any> = ({showModal}) => {
  const {nickname, setNickname} = useNicknameState();
  const containerStyle = {backgroundColor: 'white', padding: 50};
  return (
    <View style={styles.container}>
      <Text>닉네임</Text>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>{nickname}</Text>
        <IconButton
          icon="pencil"
          iconColor="black"
          size={20}
          onPress={showModal}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    width : "100%",
    //backgroundColor: "#F8FCEC",
    alignItems: "flex-start",
    justifyContent: "center",
    padding : 16,
  },
  imgContainer: {
    flex: 1,
    //backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    flex: 1,
    //backgroundColor: "blue",
    width : "100%",
    flexDirection : "row",
    height: "100%",
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
  text: {
    fontSize: 24,
    color: "#333",
  },
});

export default UserInfo;
