import React from "react";
import { useState } from "react";
import { Text, View, Image } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const MaleButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const onPress = () => {
    setIsPressed(!isPressed);
    console.log("hi");
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.btn, isPressed && styles.btnPressed]}
      onPress={onPress}
    >
      <Icon name="male" size={50} color="black" />
      <Text style={styles.txt}>남성</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontSize: 16,
    color: "#333",
  },
  btn: {
    width: 100,
    height: 100,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
  },
  btnPressed: {
    backgroundColor: "#A9A9A9",
  },
});

export default MaleButton;
