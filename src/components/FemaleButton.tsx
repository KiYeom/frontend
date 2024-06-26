import React from "react";
import { Text, View, Image } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const FemaleButton: React.FC = () => {
  const onPress = () => {
    console.log("hi");
  };
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={onPress}>
      <Icon name="female" size={50} color="black" />
      <Text style={styles.txt}>여성</Text>
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
});

export default FemaleButton;
