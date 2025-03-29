export type TChatAnswer = {
  answer: string;
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
  status: 'user' | 'bot';
  text: string;
  utcTime: string;
};

//좋아하는 데이터 불러오기
export type TFavoriteChat = {
  chats: TFavoriteChatLog[];
};
export type TFavoriteChatLog = {
  id: string;
  date: string;
  answer: string;
};
