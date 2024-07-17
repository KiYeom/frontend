
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
  let hours = date.getHours(); //시 0~24 를 받아오고
  const minutes = date.getMinutes(); //분 0~59을 받아오고
  const period = hours >= 12 ? '오후' : '오전'; // 오전과 오후를 시로 구분한다
  hours = hours % 12;
  hours = hours ? hours : 12; //12로 나눴는데 0이면 24시 또는 0시이니, 12로 고정
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; //분이 0~9 사이면 앞에 0을 붙인다.
  return `${period} ${hours}:${formattedMinutes}` // [오전/오후]시:분 형태로 출력
}

const Chat: React.FC = () => {
  const flatListRef = useRef<FlatList | null>(null);
  //flatList 컴포넌트의 메서드 (scrollToTop)를 호출하기 위한 변수 (객체를 반환)
  //객체에 있는 값에 접근하기 위해서는 current로 접근하면 된다 
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
    flatListRef.current?.scrollToOffset({offset : 0, animated : true});
    //scrollToOffset 메서드는 FlatList의 스크롤 위치를 특정 오프셋으로 이동시킨다.
    //offset = 스크롤할 오프셋 위치, 0은 맨 위 (인데.. inverted되어서 맨 밑)
  }
  
  useEffect(() => {
    loadChatLogs() //앱을 처음 켰을 때 대화의 모든 내용을 스토리지에 꺼내서 출력
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
    <View style = {{backgroundColor : "#F0F3F8"}}>
      {item.sender != "user" ? (
        <View style={styles.botMessageContainer}>
          <View style = {{flexDirection : "row", backgroundColor : "blue"}}>
            <Image source={require("../../assets/cookieSplash.png")} style={styles.img} />
            <View style = {{backgroundColor : "red", width : "100%"}}>
              <Text style={styles.ai}>쿠키</Text>
              <View style={{flexDirection : "row", alignItems : "flex-end"}}>
                <View style={[styles.bubble, styles.botBubble]}>
                  <Text style={styles.text}>{item.text}</Text>
                </View>
                <Text>{item.date}</Text>
              </View>
            </View>  
          </View>
        </View>
      ) : (
        <View style={styles.userMessageContainer}> 
          <Text>{item.date}</Text>
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
        behavior={"padding"}>
        <FlatList
          ref = {flatListRef} 
          inverted
          data={data}
          renderItem={renderItem}
          style = {styles.flatList} //flatlist 컴포넌트 자체에 스타일을 적용 -> flatlist의 크기, 배경색, 테두리 등의 스타일 지정
          contentContainerStyle = {styles.contentContainerStyle} 
          //flatlist의 "콘텐츠 컨테이너"에 스타일을 적용 -> 스크롤뷰 콘텐츠에 패딩을 추가하거나 정렬 설정, 아이템 감싸는 뷰에 스타일 적용할 때
          keyExtractor = {data => data.id}
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
            //onFocus = {scrollToTop}
          />
          <IconButton
            icon="arrow-up"
            iconColor = "white"
            containerColor="#FF6B6B"
            size={25}
            onPress={() => {
              userSend()
              //scrollToTop()
              //getTime()
            }}
            disabled = {btnDisable}
          />
        </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding : 16,
  },
  flatList : {
    //flexGrow : 1,
    //padding : 16,
    backgroundColor : "pink",
  },
  contentContainerStyle : {
    //backgroundColor : "red",
    paddingLeft : 32,
    paddingRight : 32,
    minHeight : "100%",
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
    backgroundColor : "pink",
  },
  userMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  bubble: {
    padding: 10,
    marginTop : 10,
    //marginVertical: 10,
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