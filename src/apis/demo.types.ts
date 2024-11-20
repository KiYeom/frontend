export type TDemoChats = {
  chats: TDemoChat[];
};

export type TDemoChat = {
  _id: string;
  createdAt: string; // 2021-08-31T07:00:00.000Z
  text: string;
  user: {
    _id: number;
    name: string;
    avatar: number | undefined;
  };
};
