import { debounce } from 'lodash';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { Message } from '../../../constants/Constants';
import Analytics from '../../../utils/analytics';
import { aiSend, botAnswer, saveChatLogs, userSend } from '../../../utils/Chatting';
import { saveAiResponse } from '../../../utils/storageUtils';
import Input from '../../input/input';
import { TextInputContainer } from './Chat.style';

const ChatInput = ({ data, setData }: any) => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sentenceRef = useRef<string[]>([]); // sentence 배열을 useRef로 관리
  const timeoutRef = useRef(null);

  //챗봇의 말풍선 (...)을 만들어 보여주고, 답변을 보여주는 setBubble 함수
  const setBubble = async () => {
    if (sentenceRef.current.length === 0) return;
    setIsLoading(true);
    //1. 챗봇 ... 말풍선을 보여준다
    setData((prevData: any) => {
      const newData = [botAnswer(), ...prevData];
      saveChatLogs(newData);
      return newData;
    });
    //2. ai의 답변을 가지고 온다.
    //const aiResponse = await testResponseFunc(sentenceRef.current);
    Analytics.aiRequestSentStatus();
    const aiResponse = await apiTestResponseFunc(sentenceRef.current);
    saveAiResponse(aiResponse.text);
    //3. 답변을 받아오면 (...)을 받아온 답변으로 변경해준다
    setData((prevData: Message[]) => {
      if (prevData.length === 0) return prevData;
      const updatedFirstMessage = {
        ...prevData[0],
        text: aiResponse.text,
      };
      const newData = [updatedFirstMessage, ...prevData.slice(1)];
      return newData;
    });
    sentenceRef.current.length = 0; //유저 텍스트 값 초기화
    setIsLoading(false);
  };

  //키보드 혹은 확인 버튼을 누르고, 2초 후에 action을 실행시키는 handleKeyPress 함수
  const handleKeyPress = () => {
    // 기존에 타이머가 돌아가고 있었으면 멈춘다
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // 멈추고 타이머를 새로 돌리며, 2초가 지나면 setBubble 함수가 실행된다.
    timeoutRef.current = setTimeout(async () => {
      setBubble();
    }, 1500); // 1초 후에 실행
  };

  const changeText = (newText) => {
    setText(newText);
  };

  //메세지 보내기 버튼을 클릭했을 때 동작하는 함수
  const testFunc = () => {
    //아무런 내용을 작성하지 않고 버튼을 클릭한 경우
    if (text === '') {
      return;
    }
    // 작성하고 버튼을 클릭한 경우 : 현재 작성한 텍스트를 sentence 배열에 추가
    sentenceRef.current.push(text);
    setText(''); // text input을 초기화함
    handleKeyPress(); //타이머 돌리고
    const userQuestion = userSend(text); //유저가 보낸 말을 말풍선으로 만들고
    setData((prevData: any) => {
      //말풍선 데이터에 저장
      //console.log('------userQuestion-------', userQuestion);
      //console.log('-----------prevData--------', prevData);
      // prevData가 배열인지 확인
      const newData = [userQuestion, ...(Array.isArray(prevData) ? prevData : [])];
      saveChatLogs(newData);
      return newData;
      //const newData = [userQuestion, ...prevData];
      //saveChatLogs(newData);
      //return newData;
    });
  };

  const apiTestResponseFunc = debounce(
    async (userSentence: string[]) => {
      //testResponseFunc(sentenceRef.current);
      const test = userSentence.join(' ');
      const aiTestResponse = await aiSend(test);
      saveAiResponse(aiTestResponse.text); //ai의 답변 저장
      return aiTestResponse;
    },
    1000,
    { leading: true, trailing: false },
  );

  //유저가 한 말을 모두 뭉쳐서 ai의 답변을 받는 함수
  //const testResponseFunc = async (userSentence: string[]) => {
  //const test = userSentence.join(' ');
  //const aiTestResponse = await aiSend(test);
  //saveAiResponse(aiTestResponse.text); //ai의 답변 저장
  //return aiTestResponse;
  //};

  return (
    <View>
      <TextInputContainer>
        <Input
          placeholder="메세지 입력"
          withMessage={false}
          showRightIcon={true}
          rightIcon="airplane"
          value={text}
          onChange={(newText) => changeText(newText)}
          onPressIcon={testFunc}
          disabled={isLoading || text.trim() === ''} //loading중일때는 혹은 빈칸만 작성했으면 버튼이 눌리면 안 됨
          onKeyPress={handleKeyPress}
        />
      </TextInputContainer>
    </View>
  );
};

export default ChatInput;
