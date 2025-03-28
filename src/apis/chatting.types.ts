export type TChatAnswer = {
  answer: string;
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
