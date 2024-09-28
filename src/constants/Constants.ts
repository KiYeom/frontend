import { TNotificationType } from './types';

export const CHATLOG = 'CHATLOG';

export const ERRORMESSAGE = '혹시 다시 얘기해주실 수 있나요? 멍멍!🐶🐾';

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
  SmallEmotionChart = 'SmallEmotionChart',
  Profile = 'Profile',
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

export const emotions = [
  [
    { group: 'angry', keyword: '격분한', desc: '몹시 분하고 화가 난' },
    { group: 'angry', keyword: '질투하는', desc: '남이 잘되는 것을 시기하는' },
    { group: 'angry', keyword: '경멸하는', desc: '남을 깔보거나 무시하는' },
    { group: 'sad', keyword: '굴욕적인', desc: '수치스럽고 창피한' },
    { group: 'sad', keyword: '죄책감을 느끼는', desc: '잘못한 일에 대해 미안해하는' },
    { group: 'sad', keyword: '비참한', desc: '아주 슬프고 불쌍한' },
  ],
  [
    { group: 'angry', keyword: '압도된', desc: '너무 많거나 강해 감당하기 힘든' },
    { group: 'angry', keyword: '화난', desc: '기분이 상하거나 불쾌한' },
    { group: 'angry', keyword: '걱정하는', desc: '불안하고 염려하는' },
    { group: 'sad', keyword: '불안정한', desc: '마음이 안정되지 않은' },
    { group: 'sad', keyword: '슬픈', desc: '마음이 아프고 괴로운' },
    { group: 'sad', keyword: '지친', desc: '피곤하고 힘이 빠진' },
  ],
  [
    { group: 'angry', keyword: '짜증나는', desc: '기분이 나쁘고 성가신' },
    { group: 'angry', keyword: '혼란스러운', desc: '정리가 안 되고 어지러운' },
    { group: 'angry', keyword: '불편한', desc: '편하지 않고 거북한' },
    { group: 'sad', keyword: '지루한', desc: '흥미가 없고 따분한' },
    { group: 'sad', keyword: '외로운', desc: '혼자 있어서 쓸쓸한' },
    { group: 'sad', keyword: '무력한', desc: '힘이 없고 아무것도 할 수 없는' },
  ],
  [
    { group: 'happy', keyword: '놀란', desc: '예상치 못한 일로 깜짝 놀란' },
    { group: 'happy', keyword: '활기찬', desc: '생기 있고 에너지가 넘치는' },
    { group: 'happy', keyword: '기쁜', desc: '마음이 즐겁고 행복한' },
    { group: 'calm', keyword: '차분한', desc: '침착하고 조용한' },
    { group: 'calm', keyword: '편안한', desc: '마음이 편하고 안정된' },
    { group: 'calm', keyword: '자유로운', desc: '구속받지 않고 마음대로 할 수 있는' },
  ],
  [
    { group: 'happy', keyword: '신나는', desc: '기분이 좋고 흥겨운' },
    { group: 'happy', keyword: '행복한', desc: '아주 기쁘고 좋은' },
    { group: 'happy', keyword: '자신 있는', desc: '스스로를 믿고 당당한' },
    { group: 'calm', keyword: '존중받는', desc: '남에게 인정받고 귀하게 여겨지는' },
    { group: 'calm', keyword: '만족하는', desc: '원하는 대로 되어 기쁜' },
    { group: 'calm', keyword: '안정된', desc: '불안함이 없이 편안한' },
  ],
  [
    { group: 'happy', keyword: '황홀한', desc: '너무 좋아서 어찌할 바를 모르는' },
    { group: 'happy', keyword: '자랑스러운', desc: '스스로 또는 남의 일이 대견한' },
    { group: 'happy', keyword: '성취감이 드는', desc: '목표를 이루어 기쁜' },
    { group: 'calm', keyword: '사랑받는', desc: '누군가에게 소중하게 여겨지는' },
    { group: 'calm', keyword: '감동받은', desc: '마음이 크게 움직이는' },
    { group: 'calm', keyword: '감사하는', desc: '고마운 마음을 느끼는' },
  ],
];

export const emotionData = {
  격분한: { desc: '몹시 분하고 화가 난', group: 'angry' },
  질투하는: { desc: '남이 잘되는 것을 시기하는', group: 'angry' },
  경멸하는: { desc: '남을 깔보거나 무시하는', group: 'angry' },
  굴욕적인: { desc: '수치스럽고 창피한', group: 'sad' },
  '죄책감을 느끼는': { desc: '잘못한 일에 대해 미안해하는', group: 'sad' },
  비참한: { desc: '아주 슬프고 불쌍한', group: 'sad' },
  압도된: { desc: '너무 많거나 강해 감당하기 힘든', group: 'angry' },
  화난: { desc: '기분이 상하거나 불쾌한', group: 'angry' },
  걱정하는: { desc: '불안하고 염려하는', group: 'angry' },
  불안정한: { desc: '마음이 안정되지 않은', group: 'sad' },
  슬픈: { desc: '마음이 아프고 괴로운', group: 'sad' },
  지친: { desc: '피곤하고 힘이 빠진', group: 'sad' },
  짜증나는: { desc: '기분이 나쁘고 성가신', group: 'angry' },
  혼란스러운: { desc: '정리가 안 되고 어지러운', group: 'angry' },
  불편한: { desc: '편하지 않고 거북한', group: 'angry' },
  지루한: { desc: '흥미가 없고 따분한', group: 'sad' },
  외로운: { desc: '혼자 있어서 쓸쓸한', group: 'sad' },
  무력한: { desc: '힘이 없고 아무것도 할 수 없는', group: 'sad' },
  놀란: { desc: '예상치 못한 일로 깜짝 놀란', group: 'happy' },
  활기찬: { desc: '생기 있고 에너지가 넘치는', group: 'happy' },
  기쁜: { desc: '마음이 즐겁고 행복한', group: 'happy' },
  차분한: { desc: '침착하고 조용한', group: 'calm' },
  편안한: { desc: '마음이 편하고 안정된', group: 'calm' },
  자유로운: { desc: '구속받지 않고 마음대로 할 수 있는', group: 'calm' },
  신나는: { desc: '기분이 좋고 흥겨운', group: 'happy' },
  행복한: { desc: '아주 기쁘고 좋은', group: 'happy' },
  '자신 있는': { desc: '스스로를 믿고 당당한', group: 'happy' },
  존중받는: { desc: '남에게 인정받고 귀하게 여겨지는', group: 'calm' },
  만족하는: { desc: '원하는 대로 되어 기쁜', group: 'calm' },
  안정된: { desc: '불안함이 없이 편안한', group: 'calm' },
  황홀한: { desc: '너무 좋아서 어찌할 바를 모르는', group: 'happy' },
  자랑스러운: { desc: '스스로 또는 남의 일이 대견한', group: 'happy' },
  '성취감이 드는': { desc: '목표를 이루어 기쁜', group: 'happy' },
  사랑받는: { desc: '누군가에게 소중하게 여겨지는', group: 'calm' },
  감동받은: { desc: '마음이 크게 움직이는', group: 'calm' },
  감사하는: { desc: '고마운 마음을 느끼는', group: 'calm' },
};
