import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Message } from '../../../constants/Constants';
import { botAnswer, loadChatLogs, saveChatLogs } from '../../../utils/Chatting';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getAiResponse, getChatting, getUserNickname } from '../../../utils/storageUtils';
import { DateLine, DateLineText } from './Chat.style';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

const Chat: React.FC = ({ navigation }) => {
  const flatListRef = useRef<FlatList<any>>(null);
  const userName = getUserNickname();
  //const [data, setData] = useState<Message[]>(getChatting() ? JSON.parse(getChatting()) : []);
  const [data, setData] = useState<Message[]>(() => {
    const savedChatting = getChatting();
    if (savedChatting) {
      //console.log('이전에 대화함', savedChatting);
      return JSON.parse(savedChatting);
    } else {
      //console.log('처음 대화를 시작함');
      const welcomeMessage = [botAnswer()];
      welcomeMessage[0].text = `안녕하세요, ${userName}님! 저는 항상 ${userName}님 곁에서 항상 힘이 되어드리고 싶은 리트리버 쿠키예요🐶💚 함께 있는 동안 ${userName}남에게 작은 위로와 행복을 전해드리고 싶어요!🍀💕`;
      saveChatLogs(welcomeMessage);
      return welcomeMessage;
    }
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    loadChatLogs({ data, setData });
    //console.log('===채팅창 시작===', data);
    if (Array.isArray(data) && data.length > 1) {
      //console.log('&&&&&&', data, Array.isArray(data));
      //console.log('데이터 있음');
      const newData = [...data]; // 기존 data를 복사
      newData[0].text = getAiResponse(); // 복사한 배열의 첫 번째 요소의 text를 변경
      setData(newData); // 상태 업데이트
    }
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    saveChatLogs(data);
  }, [data]);

  const renderItem = ({ item, index }: any) => {
    //console.log('renderitem', item);
    const currentDate = item.date;
    const nextDate = index + 1 < data.length ? data[index + 1].date : undefined;
    let showDateLine = currentDate !== nextDate || nextDate === undefined;

    return (
      <View>
        {showDateLine && (
          <DateLine>
            <DateLineText>{item.date}</DateLineText>
          </DateLine>
        )}
        <ChatBubble
          status={item.sender}
          text={item.text}
          time={item.time}
          navigation={navigation}
        />
      </View>
    );
  };

  return (
    <View
      style={css`
        flex: 1;
        padding-bottom: ${20 * rsHeight + 'px'};
      `}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}>
        <View style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <FlatList
            ref={flatListRef}
            inverted
            data={data}
            keyExtractor={(item) => item.text + '.' + item.id}
            renderItem={renderItem}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-end',
              paddingHorizontal: 20 * rsWidth,
              gap: 20 * rsHeight,
            }}
            keyboardShouldPersistTaps="handled"
            extraData={data}
          />
          <ChatInput data={data} setData={setData} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;
