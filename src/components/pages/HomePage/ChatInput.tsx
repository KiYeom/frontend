import React from 'react';
import { useState } from 'react';
import { TextInputContainer } from './Chat.style';
import Input from '../../input/input';
import { userSend, aiSend } from '../../../utils/Chatting';
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
          //saveChatLogs(JSON.stringify(userQuestion));
          setText('');
          setData((prevData) => {
            const newData = [userQuestion, ...prevData];
            saveChatLogs(newData);
            return newData;
          });

          //saveChatLogs(JSON.stringify(data));
          //console.log('유저가 물어봄', text);
          const aiResponse = await aiSend(text);
          //saveChatLogs(JSON.stringify(aiResponse));
          //console.log('aiResponse===============', aiResponse);
          setData((prevData) => {
            const newData = [aiResponse, ...prevData];
            saveChatLogs(newData);
            return newData;
          });
          //saveChatLogs(JSON.stringify(data));
        }}
      />
    </TextInputContainer>
  );
};
export default ChatInput;
