import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import ChatBubble from "../components/ChatBubble";
import { callGpt } from "../model/Gpt";
import { Image } from "react-native";

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const originData =  [
  {
    sender : "user",
    text : "my name is eunseo",
  },
  {
    sender : "bot",
    text : "hi eunseo",
  }
]

const Chat: React.FC = () => {
  const [text, setText] = useState(""); //유저가 작성한 말
  const [data, setData] = useState(originData);
  const aiSend = async () => {
    const aiResponse = await callGpt(text);
    console.log("aiResponse ", aiResponse);
    setTimeout(()=> {
      const aiData = {sender : "bot", text : `${aiResponse}`};
      setData (prevData => {
        const updatedData = [...prevData, aiData];
        return updatedData;
      })
    }, 1000);
  }
  const userSend = () => {
    const userData = {sender : "user", text : `${text}`}
    setData(prevData => {
      const updatedData = [...prevData, userData];
      return updatedData;
    })
    setText("");
    aiSend();
  }
  const renderItem = ({ item }:any) => (
    <View style={styles.messageContainer}>
      {item.sender != "user" ? (
        <View style={styles.botMessageContainer}>
          <Image source={require("../../assets/cookieSplash.png")} style={styles.img} />
          <View style={{flex: 1}}>
            <Text style={styles.ai}>쿠키</Text>
            <View style={[styles.bubble, styles.botBubble]}>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.userMessageContainer}>
          <View style={[styles.bubble, styles.userBubble]}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
          {/*<Image source={require("../../assets/cookieSplash.png")} style={styles.img} />*/}
        </View>
      )}
    </View>
  );

  return (
    <View style = {styles.container }>
      <FlatList
        data = {data}
        renderItem = {renderItem}
      />
      <View style = {styles.form}>
        <TextInput
          label="send message to cookie🐶"
          value={text}
          onChangeText={text => setText(text)}
          mode = "outlined"
          style = {styles.input}
        />
        <Button mode = "contained" onPress = {userSend} style = {styles.btn}>
          send
        </Button>
      </View>
    </View>
      
    )
  }

  
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      padding: 16,
    },
    form: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      paddingBottom: 10,
      paddingTop: 10,
    },
    input: {
      width: "75%",
    },
    btn: {
      width: "22%",
      justifyContent: "center",
      backgroundColor: "#FF6B6B",
    },
    chat: {
      flex: 1,
    },
    messageContainer: {
      marginVertical: 10,
      //backgroundColor : "red",
    },
    botMessageContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      //backgroundColor : "blue",
      maxWidth : "80%",
    },
    userMessageContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      //backgroundColor : "gray",
    },
    bubbleContainer: {
      flexDirection: "row",
      width: "100%",
    },
    bubble: {
      padding: 10,
      marginVertical: 10,
      borderRadius: 10,
      maxWidth: '70%',
    },
    userBubble: {
      backgroundColor: '#58C3A5',
      alignSelf: 'flex-end',
    },
    botBubble: {
      backgroundColor: '#D7E6DB',
      alignSelf: 'flex-start',
    },
    ai: {
      paddingTop : 5,
      alignSelf: 'flex-start',
    },
    user: {
      alignSelf: 'flex-end',
    },
    text: {
      color: 'black',
      alignSelf: 'flex-start',
    },
    img: {
      width: 50,
      height: 50,
      borderRadius: 25,
      margin: 5,
    },
  });
export default Chat;