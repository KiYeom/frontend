// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer, //chat 상태를 store 에 등록
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
