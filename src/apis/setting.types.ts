export type TAllowedNotifications = {
  allowedNotifications: TNotification[];
};

export type TNotification = 'system' | 'chat_cookie';

export type TSetNotification = {
  notificationName: string;
  isAllow: boolean;
};

export type TUserInfo = {
  id: number;
  nickname: string | null;
  birthdate: string | null;
  gender: string | null;
  isUser: boolean;
};
