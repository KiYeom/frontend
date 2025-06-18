// redux/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage, GiftedChat } from 'react-native-gifted-chat';

interface SerializableMessage extends Omit<IMessage, 'createdAt'> {
  createdAt: string; // ISO string
  isSaved?: boolean; // 새 필드 추가
}

interface ChatState {
  messages: SerializableMessage[];
  inputText: string;
}

const initialState: ChatState = {
  messages: [],
  inputText: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    //메세지를 추가
    sendMessages(state, action: PayloadAction<SerializableMessage[]>) {
      state.messages = GiftedChat.append(state.messages, action.payload);
    },
    //입력중인 텍스트 상태 저장
    setInputText(state, action: PayloadAction<string>) {
      state.inputText = action.payload;
    },
    //메세지를 찜하거나 해제
    toggleMessageSaved(state, action: PayloadAction<string | number>) {
      const target = state.messages.find((msg) => msg._id === action.payload);
      if (target) {
        target.isSaved = !target.isSaved; // ⬅️ 토글 처리
      }
    },
  },
});

export const { sendMessages, setInputText, toggleMessageSaved } = chatSlice.actions;
export default chatSlice.reducer;
