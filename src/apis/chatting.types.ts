import { IMessage } from 'react-native-gifted-chat';
export type TChatAnswer = {
  answer: string;
};

export type TChatSendPhotoPermission = {
  canSendPhoto: boolean;
};
//1.5.7 UPDATE
export type TChatAnswerV3 = TChatLogV3[];
export type TChatLogV3 = {
  answer: string | null;
  id: string;
  question: string | null;
};

export type TOldAnswer = {
  chats: TAppChat[];
};

export type TAppChat = {
  id: string;
  status: 'user' | 'bot';
  text: string;
  isSaved: boolean;
  utcTime: string;
};

//여러 개의 TFavoriteChatLog들을 배열에 담은 객체
export type TFavoriteChat = {
  favorites: TFavoriteChatLog[];
};
//하나의 좋아요 데이터 (id, answer, date)
export type TFavoriteChatLog = {
  id: string;
  date: string;
  answer: string;
};

//1.5.7 UPDATE 대화 찾기 결과
export type TChatSearchResult = {
  nextCursor: string | null;
};

//1.5.7 UPDATE : IMessage 타입 확장
/*
export interface ExtendedIMessage extends IMessage {
  isSaved?: boolean;
  hightlightKeyword?: string;
}
*/
