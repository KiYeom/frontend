// chatThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getV3OldChatting } from '../apis/chatting';
export interface RawChatMessage {
  id: string;
  status: 'user' | 'bot';
  text: string;
  utcTime: string;
  isSaved?: boolean;
}
export interface SerializableMessage {
  _id: string;
  text: string;
  createdAt: string; // ISO string
  user: {
    _id: number; // 1 for user, 2 for bot
  };
  isSaved?: boolean;
}
export const fetchChatMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (lastMessageDate: string, { rejectWithValue }) => {
    try {
      const response = await getV3OldChatting(1, lastMessageDate);
      console.log('Fetched chat messages:', response);

      const formatted = response.chats.map((chat, index) => ({
        _id: chat.id ?? `temp-${index}`,
        text: chat.text ?? '',
        createdAt: new Date(chat.utcTime).toISOString(),
        user: {
          _id: chat.status === 'user' ? 1 : 2,
        },
        isSaved: chat.isSaved ?? false,
      }));

      return formatted.reverse(); // ⬅️ 여기!
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Network Error');
    }
  },
);
