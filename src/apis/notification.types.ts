export type TAllowedNotifications = {
  allowedNotifications: TNotification[];
};

export type TNotification = 'system' | 'chat_cookie' | 'diary';

export type TSetNotification = {
  notificationName: string;
  isAllow: boolean;
};
