export type TAllowedNotifications = {
  allowedNotifications: TNotification[];
};

export type TNotification = 'system' | 'chat_cookie';

export type TSetNotification = {
  notificationName: string;
  isAllow: boolean;
};
