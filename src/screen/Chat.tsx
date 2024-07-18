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
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

interface Message {
  sender: string;
  text: string;
}

const getTime = (): Date => {
  const currentDate : Date = new Date();
  console.log("현재 시간 : ", currentDate);
  return currentDate;
}

const formatTime = (date : Date): string => {
  console.log("=======================", date);
  console.log("---------------------------",typeof(date));
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? '오후' : '오전';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${period} ${hours}:${formattedMinutes}`
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

  const scrollToTop = () => {
    console.log("scroll to end 함수 동작")
    flatListRef.current?.scrollToOffset({offset : 0, animated : true}); //커서 맨 끝으로
  }
  
  useEffect(() => {
    loadChatLogs()
  }, [])


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
    const today = getTime();
    const aiData = {sender : "bot", text : `${cookieAnswer}`, id : `${today}`, date : `${formatTime(today)}`}
    setData((prevData) => {
      const newData = [aiData, ...prevData];
      saveChatLogs(newData);
      return newData;
    });
    scrollToTop();
  };

  const userSend = () => {
    const today = getTime();
    const userData = {sender : "user", text : `${text}`, id : `${today}`, date : `${formatTime(today)}`}
    setData((prevData) => [userData, ...prevData]);
    setText("");
    setBtnDisable(true);
    aiSend();
  }

  const changeText = (text: string) => {
    setBtnDisable(text === "");
    setText(text);
  }
  

  const renderItem = ({ item }:any) => (
    <View style = {{padding : 16}}>
      {item.sender != "user" ? (
        <View style={styles.botMessageContainer}>
          <View style = {{flexDirection : "row"}}>
            <Image source={require("../../assets/cookieSplash.png")} style={styles.img} />
            <View style = {{width : "100%"}}>
              <Text style={styles.ai}>쿠키</Text>
              <View style={{flexDirection : "row", alignItems : "flex-end"}}>
                <View style={[styles.bubble, styles.botBubble]}>
                  <Text style={styles.text}>{item.text}</Text>
                </View>
                <Text style = {{fontSize : 13}}>{item.date}</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.userMessageContainer}> 
          <Text style = {{fontSize : 13}}>{item.date}</Text>
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
        behavior={"padding"}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref = {flatListRef}
          inverted
          data={data}
          renderItem={renderItem}
          style = {styles.flatList} //flatlist 컴포넌트 자체에 스타일을 적용 -> flatlist의 크기, 배경색, 테두리 등의 스타일 지정
          contentContainerStyle = {styles.contentContainerStyle} 
          //flatlist의 "콘텐츠 컨테이너"에 스타일을 적용 -> 스크롤뷰 콘텐츠에 패딩을 추가하거나 정렬 설정, 아이템 감싸는 뷰에 스타일 적용할 때
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
                //onFocus = {scrollToTop}
                multiline = {true}
              />
              <IconButton
                icon="arrow-up"
                iconColor = "white"
                containerColor="#FF6B6B"
                size={25}
                onPress={()=>{
                  userSend()
                  scrollToTop()
                }}
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
            multiline = {true}
            //onFocus = {scrollToTop}
          />
          <IconButton
            icon="arrow-up"
            iconColor = "white"
            containerColor="#FF6B6B"
            size={25}
            onPress={() => {
              userSend()
              scrollToTop()
            }}
            disabled = {btnDisable}
          />
        </View>
        )}
      </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : "white",
    //padding : 16,
  },
  flatList : {
    flexGrow : 0,
    //padding : 16,
    //backgroundColor : "yellow",
    //height : 200,
  },
  contentContainerStyle : {
    //backgroundColor : "white",
    flexGrow : 1,
    //minHeight : "100%",
    justifyContent : 'flex-end',
  },
  form: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems : "center",
    padding : 16,
    backgroundColor : "white",
    marginTop : 16,
    flexGrow : 1,
    //height : 100,
    height : 80,
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
    //backgroundColor : "pink",
  },
  userMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  bubble: {
    padding: 10,
    //marginVertical: 10,
    marginTop : 10,
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