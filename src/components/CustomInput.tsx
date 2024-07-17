import { View, StyleSheet } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import React from "react";
import { useState } from "react";
import { Message } from "../constants/Constants";

const CustomInput: React.FC = () => {
  const [text, setText] = useState(""); //유저가 작성한 

  return (
    <View style={styles.form}>
      <TextInput
        label="send message to cookie🐶"
        multiline = {true}
        value={text}
        onChangeText={(text) => changeText(text)}
        mode="outlined"
        outlineColor="#3B506B"
        activeOutlineColor="#3B506B"
        style={styles.textInput}
        outlineStyle = {{borderRadius : 20}}
      />
      <IconButton
        icon="arrow-up"
        iconColor = "white"
        containerColor="#FF6B6B"
        size={25}
        onPress={userSend}
        disabled = {btnDisable}
      />
    </View>
  );
}
export default CustomInput;

const styles = StyleSheet.create({
  form: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems : "center",
    padding : 16,
    backgroundColor : "white",
    marginTop : 16,
  },
  textInput: {
    flex: 1,
    //marginRight: 10,
    //borderRadius : 20,
    width : 250,
    height : 100,
  },


})