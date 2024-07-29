import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, TextInput, IconButton } from 'react-native-paper';
import ChatBubble from '../../atoms/ChatBubble';
import { Image } from 'react-native';
import axios from 'axios';
import { SPLASH_PATH, User } from '../../../constants/Constants';
import { storage } from '../../../utils/storageUtils';
import axiosInstance from '../../../utils/Api';
import { CHATLOG } from '../../../constants/Constants';
import { useFocusEffect } from '@react-navigation/native';
import { ERRORMESSAGE } from '../../../constants/Constants';
import { InputAccessoryView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import useChatBtnState from '../../../store/chatBtnState';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { getTime, formatTime } from '../../../utils/ChattingTime';
import { Message } from '../../../constants/Constants';

const Chat: React.FC = () => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [text, setText] = useState(''); //유저가 작성한 말
  const [data, setData] = useState<Message[]>([]);
  const [btnDisable, setBtnDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  //대화 로그를 저장
  const saveChatLogs = (logs: Message[]) => {
    try {
      storage.set(CHATLOG, JSON.stringify(logs));
    } catch (error) {
      console.log('저장 실패', error);
    }
  };

  //대화 로그를 화면에 출력
  const loadChatLogs = () => {
    try {
      const chatLogs = storage.getString(CHATLOG);
      if (chatLogs) {
        setData(JSON.parse(chatLogs));
      }
    } catch (error) {
      console.log('데이터 로드 실패', error);
    }
  };

  //스크롤 : 화면 맨 아래로 향하게
  const scrollToTop = () => {
    console.log('scroll to end 함수 동작');
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true }); //커서 맨 끝으로
  };

  useEffect(() => {
    loadChatLogs();
  }, []);

  const sendChatRequest = async (characterId: number, question: string) => {
    try {
      setIsLoading(true); //비활성화 (챗봇이 할 말 생각중)
      const response = await axiosInstance.post('/chat', {
        characterId: characterId,
        question: question,
      });
      return response.data.data.answer; //쿠키의 답장을 리턴
    } catch (error) {
      return ERRORMESSAGE; //api 연결이 실패한 경우 실패 메세지가 뜸
    }
  };

  const aiSend = async () => {
    const cookieAnswer = await sendChatRequest(1, text);
    const today = getTime();
    const aiData = {
      sender: 'bot',
      text: `${cookieAnswer}`,
      id: `${today}`,
      date: `${formatTime(today)}`,
    };
    setData((prevData) => {
      const newData = [aiData, ...prevData];
      saveChatLogs(newData);
      return newData;
    });
    scrollToTop();
    setIsLoading(false);
  };

  const userSend = () => {
    //setBtnDisable(true); //버튼 비활성화 on
    const today = getTime();
    const userData = {
      sender: 'user',
      text: `${text}`,
      id: `${today}`,
      date: `${formatTime(today)}`,
    };
    setData((prevData) => [userData, ...prevData]);
    setText('');
    aiSend();
  };

  const changeText = (text: string) => {
    setBtnDisable(text === '' || isLoading ? true : false);
    //빈칸이거나 flag가 true면 버튼 활성화, 아니면 버튼 비활성화
    setText(text);
  };

  const renderItem = ({ item }: any) => (
    <View style={{ padding: 16 }}>
      {item.sender !== 'user' ? ( //쿠키
        <View style={styles.botMessageContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{ uri: SPLASH_PATH }} style={styles.img} />
            <View style={{ width: '100%' }}>
              <Text style={styles.ai}>쿠키</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <View style={[styles.bubble, styles.botBubble]}>
                  <Text style={styles.text}>{item.text}</Text>
                </View>
                <Text style={{ fontSize: 13 }}>{item.date}</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        //유저
        <View style={styles.userMessageContainer}>
          <Text style={{ fontSize: 13 }}>{item.date}</Text>
          <View style={[styles.bubble, styles.userBubble]}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const headerHeight = useHeaderHeight(); //stack navigation의 header 높이

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}>
        <FlatList
          ref={flatListRef}
          inverted
          data={data}
          renderItem={renderItem}
          style={styles.flatList} //flatlist 컴포넌트 자체에 스타일을 적용 -> flatlist의 크기, 배경색, 테두리 등의 스타일 지정
          contentContainerStyle={styles.contentContainerStyle}
          //flatlist의 "콘텐츠 컨테이너"에 스타일을 적용 -> 스크롤뷰 콘텐츠에 패딩을 추가하거나 정렬 설정, 아이템 감싸는 뷰에 스타일 적용할 때
        />
        <View style={styles.form}>
          <TextInput
            label="send message to cookie🐶"
            value={text}
            onChangeText={(text) => changeText(text)}
            mode="outlined"
            outlineColor="#3B506B"
            activeOutlineColor="#3B506B"
            style={styles.textInput}
            outlineStyle={{ borderRadius: 20 }}
            multiline={true}
            //onFocus = {scrollToTop}
          />
          <IconButton
            icon="arrow-up"
            iconColor="white"
            containerColor="#FF6B6B"
            size={25}
            onPress={() => {
              userSend();
              scrollToTop();
            }}
            disabled={btnDisable}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    //padding : 16,
  },
  flatList: {
    flexGrow: 1,
    //backgroundColor: 'yellow',
    //padding : 16,
    //backgroundColor: 'yellow',
    //height : 200,
  },
  contentContainerStyle: {
    //backgroundColor : "white",
    flexGrow: 1,
    //minHeight: '100%',
    justifyContent: 'flex-end',
  },
  form: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    //backgroundColor: 'red',
    //marginTop: 16,
    //flexGrow: 1,
    //height: 80,
  },
  textInput: {
    flex: 1,
    //marginRight: 10,
    borderRadius: 20,
    //backgroundColor : "pink"
  },
  btn: {
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
  },
  messageContainer: {
    marginVertical: 10,
  },
  botMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    //backgroundColor: 'pink',
  },
  userMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    //maxWidth: '60%',
  },
  bubble: {
    padding: 10,
    //marginVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    maxWidth: '50%',
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
    marginRight: 5,
    //borderColor : "gray",
    //borderWidth : 1,
  },
});

export default Chat;
