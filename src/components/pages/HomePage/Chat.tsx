import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { BubbleText } from './ChatBubble.style';
import ChatBubble from './ChatBubble';
import Input from '../../input/input';
//import ChatBubble from '../../atoms/ChatBubble';
import { CHATLOG } from '../../../constants/Constants';
import { SafeAreaView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { getTime, formatTime, formatDate } from '../../../utils/ChattingTime';
import { Message } from '../../../constants/Constants';
import { TextInputContainer } from './Chat.style';
import { ChatContainer } from './Chat.style';
import { DateLine } from './Chat.style';
import { chatting } from '../../../apis/chatting';
import { storage } from '../../../utils/storageUtils';
//채팅 페이지

const Chat: React.FC = () => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [text, setText] = useState(''); //유저가 작성한 말
  const [data, setData] = useState<Message[]>([]);
  const [btnDisable, setBtnDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const previousDateRef = useRef(null);

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
    setIsLoading(true); //비활성화 (챗봇이 할 말 생각중)
    const response = await chatting(characterId, question); //챗봇에게 질문을 보냄
    return response.answer;
  };

  const aiSend = async () => {
    const cookieAnswer = await sendChatRequest(1, text);
    const today = getTime();
    const aiData = {
      sender: 'bot',
      text: `${cookieAnswer}`,
      id: `${today}`,
      time: `${formatTime(today)}`,
      date: `${formatDate(today)}`,
    };
    console.log('2초 지연하기');
    // 2초 후에 데이터를 업데이트
    setTimeout(() => {
      setData((prevData) => {
        const newData = [aiData, ...prevData];
        saveChatLogs(newData);
        return newData;
      });
      scrollToTop();
      setIsLoading(false);
    }, 2000); // 2초 지연
  };

  const userSend = () => {
    //setBtnDisable(true); //버튼 비활성화 on
    const today = getTime();
    const userData = {
      sender: 'user',
      text: `${text}`,
      id: `${today}`,
      time: `${formatTime(today)}`,
      date: `${formatDate(today)}`,
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

  //item.sender, item.text
  const renderItem = ({ item, index }: any) => {
    const currentDate = item.date;
    let showDateLine = false;

    console.log('==========renderItem========', item.text);
    console.log('==========currentDate========', currentDate);
    console.log('==========previousDate=======', previousDateRef.current);
    // 첫 번째 항목이거나, 이전 항목과 다른 날짜일 경우 날짜 표시
    if (index === data.length - 1 || currentDate !== previousDateRef.current) {
      showDateLine = true;
      previousDateRef.current = currentDate;
    }

    return (
      <View style={{ flex: 1 }}>
        {showDateLine && (
          <DateLine>
            <BubbleText status="date">{item.date}</BubbleText>
          </DateLine>
        )}
        <ChatBubble
          showImage={item.sender === 'bot' ? true : false}
          status={item.sender}
          text={item.text}
          time={item.time}
        />
      </View>
    );
  };

  const headerHeight = useHeaderHeight(); //stack navigation의 header 높이

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}>
        <ChatContainer>
          <FlatList
            ref={flatListRef}
            inverted
            data={data}
            renderItem={renderItem}
            style={styles.flatList} //flatlist 컴포넌트 자체에 스타일을 적용 -> flatlist의 크기, 배경색, 테두리 등의 스타일 지정
            contentContainerStyle={styles.contentContainerStyle}
            //flatlist의 "콘텐츠 컨테이너"에 스타일을 적용 -> 스크롤뷰 콘텐츠에 패딩을 추가하거나 정렬 설정, 아이템 감싸는 뷰에 스타일 적용할 때
          />
        </ChatContainer>
        <TextInputContainer>
          <Input
            placeholder="메세지 입력"
            withMessage={false}
            showRightIcon={true}
            rightIcon="airplane"
            value={text}
            onChange={(text) => changeText(text)}
            onPress={() => {
              userSend();
              scrollToTop();
              console.log('data!', data);
            }}
          />
        </TextInputContainer>
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
    //flexGrow: 1,
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
    gap: 16,
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
