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
  DangerStackNavigator = 'DangerStackNavigator',
}

export enum TabScreenName {
  Home = 'Home',
  Setting = 'Setting',
  Statistic = 'Statistic',
  Chat = 'Chat',
}

export enum TabBarLabel {
  Home = '홈',
  Chat = '채팅',
  Setting = '설정',
  Statistic = '보고서',
}

export enum HomeStackName {
  Chat = 'Chat',
  SmallEmotionChart = 'SmallEmotionChart',
  Profile = 'Profile',
  NewChat = 'NewChat',
  ChatList = 'ChatList',
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
  OrganizationConnect = 'OrganizationConnect',
  OrganizationStatus = 'OrganizationStatus',
}

export enum DangerStackName {
  Clinic = 'Clinic',
  DangerAlert = 'DangerAlert',
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

export const emotionsByColumn = [
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

export const helloTexts = [
  '언제나 당신의 곁에 있을게요.',
  '지금의 당신이 자랑스러워요.',
  '오늘도 당신을 응원해요.',
  '당신은 언제나 사랑받고 있어요.',
  '당신의 내일은 더 밝을 거예요.',
  '천천히 걷는 것도 괜찮아요.',
  '작은 성취도 큰 의미가 있어요.',
  '당신의 하루가 행복하길 바라요.',
  '지금 이 순간도 소중해요.',
  '당신의 소중함을 잊지 마세요.',
  '오늘도 당신은 빛나고 있어요.',
  '오늘도 충분히 잘 해냈어요.',
  '매일 조금씩 나아가도 괜찮아요.',
  '오늘 하루도 수고 많았어요.',
  '지금도 충분히 잘하고 있어요.',
  '오늘의 작은 성취도 소중해요.',
  '오늘 하루도 잘 보냈길 바라요.',
  '당신의 미소가 세상을 밝히네요.',
  '당신의 하루가 평온하길 바라요.',
  '당신의 모든 순간이 소중해요.',
  '당신은 항상 빛나는 존재예요.',
  '당신은 언제나 소중한 존재예요.',
  '힘들면 잠시 쉬어도 괜찮아요.',
  '당신은 언제나 특별한 존재예요.',
  '모든 것이 잘 될 거예요.',
  '오늘 하루도 충분히 잘했어요.',
  '당신의 존재만으로 충분해요.',
  '당신은 더 강해지고 있어요.',
  '지금 그대로도 당신은 소중해요.',
  '당신의 존재만으로도 충분해요.',
  '매일 조금씩 나아가고 있어요.',
  '마음이 힘들면 잠시 쉬어가세요.',
  '당신은 누구보다 소중해요.',
  '오늘도 당신은 멋진 사람이에요.',
  '한 걸음 한 걸음이 중요해요.',
  '오늘도 좋은 하루 보내세요.',
  '편안한 하루 되시길 바래요.',
  '미소 가득한 하루 보내세요.',
  '기분 좋은 하루 보내세요.',
  '즐거운 하루 되시길 바래요.',
  '환하게 웃는 하루 되세요.',
  '평온한 하루 보내세요.',
  '행복한 하루 되세요.',
  '상쾌한 하루 되길 바래요.',
  '활기찬 하루 보내세요!',
  '행복한 미소 가득하세요!',
  '좋은 일만 가득한 하루 되세요.',
  '여유로운 하루 보내세요.',
  '마음 편한 하루 되세요.',
  '오늘도 좋은 기운 받으세요!',
  '활기차고 멋진 하루 되세요.',
  '새로운 하루가 시작됐네요!',
  '밝고 평온한 하루 되세요.',
  '즐거운 순간 가득하세요.',
  '기분 좋게 하루 시작해볼까요?',
  '즐겁고 행복한 하루 되세요.',
  '따스한 마음으로 하루 보내세요.',
  '여유롭고 편안한 하루 보내세요.',
  '소중한 하루 되세요!',
  '건강하고 행복한 하루 되세요.',
  '오늘도 힘내세요!',
  '오늘도 좋은 시간 보내세요.',
  '환한 미소로 하루 시작하세요.',
  '오늘 하루도 빛나는 날 되세요.',
];

export const RISK_SCORE_THRESHOLD = 85;
export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
//export const ONE_DAY_IN_MS = 60 * 1000;
export const PHONE_NUMBER = '109';
export const MINIMUM_EMOTION_COUNT = 1;
export const MAXIMUM_EMOTION_COUNT = 5;

export const KAKAO_MESSAGE = 'https://pf.kakao.com/_DAxbYG/chat';
