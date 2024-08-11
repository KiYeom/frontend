import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { TextInputContainer } from './Chat.style';
import Input from '../../input/input';
import { userSend, aiSend, botAnswer } from '../../../utils/Chatting';
import { saveChatLogs } from '../../../utils/Chatting';
import { Message } from '../../../constants/Constants';

const ChatInput = ({ data, setData }: any) => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const changeText = (newtext: string) => {
    setText(newtext);
  };

  const onPressHandle = async () => {
    if (text === '') {
      return;
    }
    setIsLoading(true);
    const userQuestion = userSend(text);
    setText('');
    setData((prevData: any) => {
      const newData = [botAnswer(), userQuestion, ...prevData];
      saveChatLogs(newData);
      return newData;
    });

    const aiResponse = await aiSend(text);

    setData((prevData: Message[]) => {
      if (prevData.length === 0) return prevData;
      const updatedFirstMessage = {
        ...prevData[0],
        text: aiResponse.text,
      };
      const newData = [updatedFirstMessage, ...prevData.slice(1)];
      return newData;
    });
    setIsLoading(false);
  };

  return (
    <View style={{ paddingBottom: Platform.OS === 'ios' ? 20 : 0 }}>
      <TextInputContainer>
        <Input
          placeholder="메세지 입력"
          withMessage={false}
          showRightIcon={true}
          rightIcon="airplane"
          value={text}
          onChange={(newText) => changeText(newText)}
          onPressIcon={onPressHandle}
          disabled={isLoading}
        />
      </TextInputContainer>
    </View>
  );
};

export default ChatInput;
