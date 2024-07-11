import React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import ChatBubble from "../components/ChatBubble";
import { Image } from "react-native";
import axios from "axios";
import { USER } from "../constants/Constants";
import { storage } from "../../utils/storageUtils";
import axiosInstance from "../model/Chatting";
import { CHATLOG } from "../constants/Constants";
import { useFocusEffect } from "@react-navigation/native";

interface Message {
  sender: string;
  text: string;
}

const Chat: React.FC = () => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [text, setText] = useState(""); //유저가 작성한 말
  const [data, setData] = useState<Message[]>([]);
  const [btnDisable, setBtnDisable] = useState(true);

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

  useEffect(() => {
    loadChatLogs()
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated : false});
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: false });
      }
    }, [data])
  );

  useEffect(()=> {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated:true})
    }
  }, [data]); 

  const sendChatRequest = async (characterId:number, question:string) => {
    try {
      const response = await axiosInstance.post('/v1/chat', {
        characterId: characterId,
        question: question
      });
      return response.data.data.answer;
    } catch (error) {
      console.error('요청 실패:', error);
    }  
  };

  const aiSend = async () => {
    const cookieAnswer = await sendChatRequest(1, text);
    setTimeout(()=> {
      const aiData = {sender : "bot", text : `${cookieAnswer}`};
      setData((prevData) => {
        const newData = [...prevData, aiData];
        saveChatLogs(newData);
        return newData;
      });
    }, 1000);
  };

  const userSend = () => {
    const userData = {sender : "user", text : `${text}`}
    setData((prevData) => [...prevData, userData]);
    setText("");
    setBtnDisable(true);
    aiSend();
  }

  const changeText = (text: string) => {
    setBtnDisable(text === "");
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
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated : false})}
        onLayout={() => flatListRef.current?.scrollToEnd({animated : false})}
        refreshing={true}
      />
      <View style={styles.form}>
        <TextInput
          label="send message to cookie🐶"
          value={text}
          onChangeText={(text) => changeText(text)}
          mode="outlined"
          outlineColor="#3B506B"
          activeOutlineColor="#3B506B"
          style={styles.input}
        />
        <Button mode="contained" onPress={userSend} style={styles.btn} disabled={btnDisable}>
          send
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  btn: {
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
  },
  messageContainer: {
    marginVertical: 10,
  },
  botMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth : "80%",
  },
  userMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
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
    paddingTop: 5,
    alignSelf: 'flex-start',
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
