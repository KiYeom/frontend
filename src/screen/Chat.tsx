import React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, TextInput, IconButton } from 'react-native-paper';
import ChatBubble from "../components/ChatBubble";
import { Image } from "react-native";
import axios from "axios";
import { USER } from "../constants/Constants";
import { storage } from "../../utils/storageUtils";
import axiosInstance from "../model/Chatting";
import { CHATLOG } from "../constants/Constants";
import { useFocusEffect } from "@react-navigation/native";
import { ERRORMESSAGE } from "../constants/Constants";
import { InputAccessoryView } from "react-native";

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
      const response = await axiosInstance.post('/chat', {
        characterId: characterId,
        question: question
      });
      return response.data.data.answer; //쿠키의 답장을 리턴
    } catch (error) {
      return ERRORMESSAGE; //api 연결이 실패한 경우 실패 메세지가 뜸
    }  
  };

  const aiSend = async () => {
    const cookieAnswer = await sendChatRequest(1, text);
    const aiData = {sender : "bot", text : `${cookieAnswer}`}
    setData((prevData) => {
      const newData = [...prevData, aiData];
      saveChatLogs(newData);
      return newData;
    });
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
    <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={"padding"}
      >
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated : false})}
          onLayout={() => flatListRef.current?.scrollToEnd({animated : false})}
          refreshing={true}
          style = {styles.flatList}
        />
        {Platform.OS === "ios" ? (
          <InputAccessoryView>
            <View style={styles.form}>
              <TextInput
                label="send message to cookie🐶"
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
          </InputAccessoryView>
        ) : (
        <View style={styles.form}>
          <TextInput
            label="send message to cookie🐶"
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
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding : 16,
  },
  flatList : {
    padding : 16,
  },
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
    borderRadius : 20,
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
