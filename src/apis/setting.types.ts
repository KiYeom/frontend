import { TGender } from '../constants/types';

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
  organization: string | null;
  gender: TGender | null;
  isUser: boolean;
  isInFormal: boolean;
  wantsEmo: boolean;
  createdAt: string;
  canSendPhoto: boolean;
  userTier: 'pro' | 'free';
};

export type TDisplayUserInfo = {
  nickname: string | null;
  birthdate: string | null;
  gender: TGender | null;
};

export type TLatestVersion = {
  latestVersion: string;
};
