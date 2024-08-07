import React from 'react';
import { useState } from 'react';
import { TextInputContainer } from './Chat.style';
import Input from '../../input/input';
import { userSend, aiSend, botAnswer } from '../../../utils/Chatting';
import { saveChatLogs } from '../../../utils/Chatting';

const ChatInput = ({ data, setData }: any) => {
  const [text, setText] = useState<string>(''); //유저가 키보드에 작성한 글자
  const changeText = (newtext: string) => {
    //setBtnDisable(text === '' || isLoading ? true : false);
    //빈칸이거나 flag가 true면 버튼 활성화, 아니면 버튼 비활성화
    setText(newtext);
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
        onPress={async () => {
          //여기서 state 관리가 잘 되지 않아 렌더링이 두 번 되는 것 같음
          const userQuestion = userSend(text);
          //const botAnswer = botAnswer();
          //saveChatLogs(JSON.stringify(userQuestion));
          setText('');
          setData((prevData: any) => {
            const newData = [botAnswer(), userQuestion, ...prevData];
            saveChatLogs(newData);
            return newData;
          });
          console.log('변경', data);
          //saveChatLogs(JSON.stringify(data));
          //console.log('유저가 물어봄', text);
          const aiResponse = await aiSend(text);
          //saveChatLogs(JSON.stringify(aiResponse));
          //console.log('aiResponse===============', aiResponse);
          setData((prevData: Message[]) => {
            if (prevData.length === 0) return prevData; // 배열이 비어 있는 경우 처리
            const updatedFirstMessage = {
              ...prevData[0], // 첫 번째 메시지 객체를 복사
              text: aiResponse.text, // AI 응답의 텍스트로 업데이트
            };
            const newData = [updatedFirstMessage, ...prevData.slice(1)]; // 첫 번째 메시지만 업데이트
            saveChatLogs(newData); // 업데이트된 데이터를 저장
            console.log('최종 상태:', newData); // 상태가 업데이트된 후 로그
            return newData;
          });
          //isLoading(true);
          //saveChatLogs(JSON.stringify(data));
        }}
      />
    </TextInputContainer>
  );
};
export default ChatInput;
