import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { BubbleText } from './ChatBubble.style';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { SafeAreaView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { ChatContainer } from './Chat.style';
import { DateLine } from './Chat.style';
import { Message } from '../../../constants/Constants';
import { rsHeight } from '../../../utils/responsive-size';
import { loadChatLogs, saveChatLogs } from '../../../utils/Chatting';

const Chat: React.FC = () => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [data, setData] = useState<Message[]>([]); //전체 대화 로그
  //const [isLoading, setIsLoading] = useState<boolean>(true);
  //화면 맨 아래로 향하도록 스크롤을 조정하는 scrollToTop 함수
  const scrollToTop = () => {
    console.log('scroll to end 함수 동작'); //TODO : 왜 또 렌더링되는 것 같지
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true }); //커서 맨 끝으로
  };

  //처음에 실행할 때는 모든 log를 렌더링한다.
  useEffect(() => {
    loadChatLogs({ data, setData });
    console.log('useEffect', data);
  }, []);

  //유저 데이터가 바뀔 때마다 스토리지에 누적하여 저장한다.
  useEffect(() => {
    saveChatLogs(data);
  }, [data]);

  const renderItem = ({ item, index }: any) => {
    const currentDate = item.date; //현재 날짜
    const nextDate = index + 1 < data.length ? data[index + 1].date : undefined; //다음 날짜
    let showDateLine = false;

    //console.log('==========renderItem========', item.text, item.time);
    //console.log('&&&&&&&&&&currentDate&&&&&&&&&&&', currentDate);
    if (currentDate !== nextDate || nextDate === undefined) {
      //날짜구분선을 그어주는 조건
      showDateLine = true;
    }

    return (
      <View style={{ flex: 1 }}>
        {showDateLine && (
          <DateLine>
            <BubbleText status="date">{item.date}</BubbleText>
          </DateLine>
        )}
        <ChatBubble status={item.sender} text={item.text} time={item.time} />
      </View>
    );
  };

  const headerHeight = useHeaderHeight(); //stack navigation의 header 높이

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#ffffff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}>
        <ChatContainer>
          <FlatList
            ref={flatListRef}
            inverted
            data={data}
            keyExtractor={(data) => data.text + '.' + data.id}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', gap: rsHeight * 20 }}
            showsVerticalScrollIndicator={false}
          />
        </ChatContainer>
        <ChatInput data={data} setData={setData} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
