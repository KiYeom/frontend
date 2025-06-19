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
    _id: number;
    name: string;
  };
  isSaved?: boolean;
}

//유저와 챗봇 오브젝트 정의
const userObject = {
  _id: 0,
  name: '나',
};

const botObject = {
  _id: 1,
  name: '쿠키',
  avatar: require('../assets/images/cookieprofile.png'), // 챗봇의 프로필 이미지
  //avatar: require(cookieprofile),
};

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (lastMessageDate: string, { rejectWithValue }) => {
    try {
      const response = await getV3OldChatting(1, lastMessageDate);
      //console.log('Fetched chat messages:', response);

      const formatted = response.chats.map((chat, index) => ({
        _id: chat.id ?? `temp-${index}`,
        text: chat.text ?? '',
        createdAt: new Date(chat.utcTime).toISOString(),
        user: chat.status === 'user' ? userObject : botObject,
        isSaved: chat.isSaved ?? false,
      }));

      return formatted.reverse(); // ⬅️ 여기!
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Network Error');
    }
  },
);
