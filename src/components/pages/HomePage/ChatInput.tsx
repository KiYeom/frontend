import React from 'react';
import { useState } from 'react';
import { TextInputContainer } from './Chat.style';
import Input from '../../input/input';
import { userSend, aiSend, botAnswer } from '../../../utils/Chatting';
import { saveChatLogs } from '../../../utils/Chatting';
import { Message } from '../../../constants/Constants';

const ChatInput = ({ data, setData }: any) => {
  const [text, setText] = useState<string>(''); //유저가 키보드에 작성한 글자
  const [isLoading, setIsLoading] = useState<boolean>(false); //답변 생성 상태

  //이벤트 핸들링1. text input에 글자를 작성할 때마다 변경한 값으로 업데이트
  const changeText = (newtext: string) => {
    setText(newtext);
  };

  //이벤트 핸들링2. text input을 클릭하여 data state를 업데이트하고 클릭 상태 (isLoading)를 관리
  const onPressHandle = async () => {
    console.log('onPressHandle 함수 실행, isLoading 상태 : ', isLoading);
    if (text === '') {
      return;
    }
    setIsLoading(true); //로딩중
    const userQuestion = userSend(text);
    setText('');
    setData((prevData: any) => {
      const newData = [botAnswer(), userQuestion, ...prevData];
      saveChatLogs(newData);
      return newData;
    });

    const aiResponse = await aiSend(text);

    setData((prevData: Message[]) => {
      if (prevData.length === 0) return prevData; // 배열이 비어 있는 경우 처리
      const updatedFirstMessage = {
        ...prevData[0], // 첫 번째 메시지 객체를 복사
        text: aiResponse.text, // AI 응답의 텍스트로 업데이트
      };
      const newData = [updatedFirstMessage, ...prevData.slice(1)]; // 첫 번째 메시지만 업데이트
      saveChatLogs(newData); // 업데이트된 데이터를 저장

      return newData;
    });
    setIsLoading(false); //로딩 완료
  };

  return (
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
  );
};
export default ChatInput;
