import React from "react";
import { Text, View, Image } from "react-native";
import { StyleSheet } from "react-native";
//import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { USER } from "../constants/Constants";

const UserInfo: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          source={require("../../assets/cookieSplash.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>{USER.NICKNAME}</Text>
        <Text style={styles.userInfoText}>{USER.EMAIL}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F8FCEC",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  imgContainer: {
    flex: 1,
    //backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    flex: 2.5,
    //backgroundColor: "blue",
    paddingLeft: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  userInfoText: {
    color: "black",
    fontSize: 20,
    padding: 5,
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
