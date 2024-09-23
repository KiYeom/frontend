import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Message } from '../../../constants/Constants';
import { loadChatLogs, saveChatLogs } from '../../../utils/Chatting';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getAiResponse, getChatting } from '../../../utils/storageUtils';
import { DateLine, DateLineText } from './Chat.style';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

const Chat: React.FC = () => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [data, setData] = useState<Message[]>(getChatting() ? JSON.parse(getChatting()) : []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    loadChatLogs({ data, setData });
    //console.log('dd', getAiResponse());
    //console.log('data', data[0]);
    if (Array.isArray(data) && data.length > 0) {
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
    //console.log('data ', data);
  }, [data]);

  const renderItem = ({ item, index }: any) => {
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
        <ChatBubble status={item.sender} text={item.text} time={item.time} />
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
