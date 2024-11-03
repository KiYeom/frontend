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
