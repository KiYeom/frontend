import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Platform,
  Keyboard,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { css } from '@emotion/native';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { DateLine } from './Chat.style';
import { Message } from '../../../constants/Constants';
import { loadChatLogs, saveChatLogs } from '../../../utils/Chatting';
import { getChatting } from '../../../utils/storageUtils';
import { StatusBar } from 'expo-status-bar';
import { useHeaderHeight } from '@react-navigation/elements';
import palette from '../../../assets/styles/theme';
import { DateLineText } from './Chat.style';

const Chat: React.FC = () => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [data, setData] = useState<Message[]>(getChatting() ? JSON.parse(getChatting()) : []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    loadChatLogs({ data, setData });

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
    const currentDate = item.date;
    const nextDate = index + 1 < data.length ? data[index + 1].date : undefined;
    let showDateLine = currentDate !== nextDate || nextDate === undefined;
    console.log('currentDate', currentDate);

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
