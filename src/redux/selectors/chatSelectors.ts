// redux/selectors/chatSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

//모든 메시지
export const selectRawMessages = (state: RootState) => state.chat.messages;

//날짜를 Date 객체로 변환해서 꺼냄
export const selectMessagesWithDate = createSelector([selectRawMessages], (rawMessages) =>
  rawMessages.map((msg) => ({
    ...msg,
    createdAt: new Date(msg.createdAt),
  })),
);
//찜한 메시지만 필터링
export const selectSavedMessages = createSelector([selectRawMessages], (messages) =>
  messages.filter((msg) => msg.isSaved),
);
//사용자가 입력한 텍스트
export const selectInputText = (state: RootState) => state.chat.inputText;
