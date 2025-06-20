import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage, GiftedChat } from 'react-native-gifted-chat';
import { fetchChatMessages } from './chatThunks'; // 비동기 액션 임포트

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
  initialState: {
    messages: [] as SerializableMessage[],
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
  },
  reducers: {
    //메세지를 추가
    sendMessages(state, action: PayloadAction<SerializableMessage[]>) {
      state.messages = GiftedChat.append(state.messages, action.payload);
    },
    //메세지를 찜하거나 해제
    toggleMessageSaved(state, action: PayloadAction<string | number>) {
      const target = state.messages.find((msg) => msg._id === action.payload);
      if (target) {
        target.isSaved = !target.isSaved; // ⬅️ 토글 처리
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = GiftedChat.append(state.messages, action.payload);
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { sendMessages, toggleMessageSaved } = chatSlice.actions;
export default chatSlice.reducer;
