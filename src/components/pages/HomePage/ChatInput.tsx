import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';
import { TextInputContainer } from './Chat.style';
import Input from '../../input/input';
import { userSend, aiSend, botAnswer } from '../../../utils/Chatting';
import { saveChatLogs } from '../../../utils/Chatting';
import { Message } from '../../../constants/Constants';

let debounceTest = '';
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
      //const newData = [userQuestion, ...prevData];
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

  const clickSubject = useRef(new Subject());
  //subject 인스턴스 생성 (시간 이벤트를 주는 사람) -> 특정 컴포넌트 참조할 수 있도록 useRef

  /*useEffect(() => {
    // 디바운싱을 적용하여 구독
    const subscription = clickSubject.current
      .pipe(
        debounceTime(300), // 300ms 동안 대기 후, 값 변경이 없을 때 마지막 값을 방출
      )
      .subscribe(() => {
        //이벤트가 일어났을 때의 상황을 확인할 때 (ex. 변수깂 변화 등) 사용
        debounceTest += text;
        console.log('디바운싱된 값 !', debounceTest);
      });

    // 컴포넌트가 언마운트될 때 unsubscribe 해주기 (메모리 누수)
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 버튼 클릭 핸들러
  const handleClick = useCallback(() => {
    clickSubject.current.next(); // 클릭 이벤트를 subject로 전송
  }, []);*/

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
          onPressIcon={onPressHandle}
          //onPressIcon={handleClick}
          disabled={false}
        />
      </TextInputContainer>
    </View>
  );
};

export default ChatInput;
