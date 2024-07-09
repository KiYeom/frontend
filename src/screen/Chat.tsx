import React from "react";
import { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import ChatBubble from "../components/ChatBubble";
import { Image } from "react-native";
import axios from "axios";
import { USER } from "../constants/Constants";
import { storage } from "../../utils/storageUtils";
import axiosInstance from "../model/Chatting";
import { CHATLOG } from "../constants/Constants";

interface Message {
  sender: string;
  text: string;
}

const Chat: React.FC = () => {
  const [text, setText] = useState(""); //유저가 작성한 말
  const [data, setData] = useState<Message[]>([]);
  const saveChatLogs = (logs : Message[]) => {
    try {
      storage.set(CHATLOG, JSON.stringify(logs))
    }
    catch(error) {
      console.log("저장 실패", error);
    }
  }
  const loadChatLogs = () => {
    try {
      const chatLogs = storage.getString(CHATLOG);
      if (chatLogs) {
        setData(JSON.parse(chatLogs));
      }
    }catch(error) {
      console.log("데이터 로드 실패", error)
    }
  }
  useEffect(()=>loadChatLogs(), [])
  const sendChatRequest = async (characterId:number, question:string) => {
    try {
      const response = await axiosInstance.post('/chat', {
        characterId: characterId,
        question: question
      });
      console.log('응답 데이터:', response.data);
      console.log("쿠키 답변", response.data.data.answer);
      return response.data.data.answer;
    } catch (error) {
      console.error('요청 실패!!! :', error);
    }    
  };

  

  const aiSend = async () => {
    console.log("유저가 한 말", text);
    const cookieAnswer = await sendChatRequest(1, text);
    console.log("aisend", cookieAnswer);
    setTimeout(()=> {
      const aiData = {sender : "bot", text : `${cookieAnswer}`};
      setData((prevData) => {
        const newData = [...prevData, aiData];
        saveChatLogs(newData);
        return newData;
      });
    }, 1000);
    //axios interceptor 적용

  };
  const userSend = () => {
    const userData = {sender : "user", text : `${text}`}
    setData((prevData) => [...prevData, userData]);
    setText("");
    setBtnDisable(true);
    aiSend();
  }
  const changeText = (text: string) => {
    if (text == "") {
      setBtnDisable(true);
    } else {
      setBtnDisable(false);
    }
    setText(text);
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
  const [btnDisable, setBtnDisable] = useState(true);
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
          onChangeText={(text) => changeText(text)}
          mode = "outlined"
          outlineColor="#3B506B"
          activeOutlineColor = "#3B506B"
          style = {styles.input}
        />
        <Button mode = "contained" onPress = {userSend} style = {styles.btn} disabled = {btnDisable}>
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