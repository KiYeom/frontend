import { TNotificationType } from './types';

export const CHATLOG = 'CHATLOG';

export const ERRORMESSAGE = '멍멍!🐶 쿠키 조금 아픈데 잠시 후에 다시 얘기해도 될까요?😣';

export const SPLASH_PATH = '/src/assets/images/splash.png';
export const COOKIE_PROFILE_PATH = './src/assets/images/setting_default_profile.png';

export const reasons = [
  '쿠키가 나의 이야기를 잘 이해하지 못했다',
  '쿠키가 나를 잘 공감해주지 못했다',
  '쿠키가 나에게 상처가 되는 말을 했다',
  '기타',
];

//채팅 로그 저장 타입
//sender : bot 혹은 user
//text : 발화자의 말
export interface Message {
  sender: string;
  text: string;
  id: string;
  time: string;
  date?: string;
}

//설정에 메뉴목록들
export interface MenuItemProps {
  title: string;
  onPress: () => void;
}

export const NotificationTypes: TNotificationType[] = ['system', 'chat_cookie'];

//Navigator에 사용될 스크린 이름들
export enum RootStackName {
  BottomTabNavigator = 'BottomTabNavigator',
  StatisStackNavigator = 'StatisStackNavigator',
  HomeStackNavigator = 'HomeStackNavigator',
  SettingStackNavigator = 'SettingStackNavigator',
  AuthStackNavigator = 'AuthStackNavigator',
}

export enum TabScreenName {
  Home = 'Home',
  Setting = 'Setting',
  Statistic = 'Statistic',
}

export enum TabBarLabel {
  Home = '홈',
  Setting = '설정',
  Statistic = '통계',
}

export enum HomeStackName {
  Chat = 'Chat',
  LargeEmotionChart = 'LargeEmotionChart',
  SmallEmotionChart = 'SmallEmotionChart',
}

export enum SettingStackName {
  EditUserInfo = 'EditUserInfo',
  PrivacyPolicy = 'PrivacyPolicy',
  UserNotifications = 'UserNotifications',
  ChannelTalk = 'ChannelTalk',
  DeactivateAlert = 'DeactivateAlert',
  DeactivateReason = 'DeactivateReason',
  LicensePage = 'LicensePage',
  LicenseDetailPage = 'LicenseDetailPage',
}

export enum StatisticStackName {
  Daily = 'Daily',
  Period = 'Period',
}

export enum AuthStackName {
  Login = 'Login',
  InputName = 'InputName',
  InputProfile = 'InputProfile',
}
