import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, TextInput } from 'react-native-paper';

const Chat: React.FC = () => {
  const [text, setText] = useState("");
  const [myText, setMyText] = useState("");
  const [aiText, setAiText] = useState("");
  const send = () => {
    console.log("보내기")
    setMyText(text);
    setText(""); 
  }
  return (
   <View style = {styles.container}>
    <View style = {styles.chat}>
      <Text>{myText}</Text>
      
    </View>
    <View style = {styles.form}>
      <TextInput
        label="send message to cookie🐶"
        value={text}
        onChangeText={text => setText(text)}
        mode = "outlined"
        style = {styles.input}
      />
      <Button mode = "contained" onPress = {send} style = {styles.btn}>
        send
      </Button>
    </View>
   </View>
    
  );
};

const styles = StyleSheet.create({
  container : {
    width : "100%",
    height : "100%",
    paddingLeft : 16,
    paddingRight : 16,
    //backgroundColor : "red",
  },
  form : {
    flexDirection : "row",
    width : "100%",
    //backgroundColor : "blue",
    justifyContent : "space-between",
    paddingBottom : 10,
    paddingTop : 10,
  },
  input : {
    width : "75%",
  },
  btn : {
    width : "22%",
    justifyContent : "center",
    backgroundColor : "#FF6B6B",
  },
  chat : {
    flex : 1,
    backgroundColor : "gray",
  }

});
export default Chat;
