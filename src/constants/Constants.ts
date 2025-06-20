import { TNotificationType } from './types';
import { SelectableEmotion } from '../store/useEmotionStore';

export const CHATLOG = 'CHATLOG';

export const ERRORMESSAGE = '혹시 다시 얘기해주실 수 있나요? 멍멍!🐶🐾';

export const SPLASH_PATH = '/src/assets/images/new_splash.png';
export const COOKIE_PROFILE_PATH = './src/assets/images/setting_default_profile.png';

export const MAX_DIARY_IMAGE_COUNT = 1; //최대 이미지 선택 개수 (일기)

export const MAX_SELECTED_EMOTION_COUNT = 5; //최대 선택 감정 개수 (일기)

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
  NewChat = 'TabNewChat',
}

export enum TabBarLabel {
  Home = '홈',
  NewChat = '채팅',
  Setting = '설정',
  Statistic = '보고서',
}

export enum HomeStackName {
  Chat = 'Chat',
  SmallEmotionChart = 'SmallEmotionChart',
  DailyDairy = 'DailyDairy',
  Profile = 'Profile',
  NewChat = 'NewChat',
  NewChatRefresh = 'NewChatRefresh',
  UpgradeNewChat = 'UpgradeNewChat',
  ChatList = 'ChatList',
  Report = 'Report', //1.5.7 UPDATE 일일 보고서
  Favorites = 'Favorites',
  Ads = 'Ads',
  Quote = 'Quote',
}

export enum SettingStackName {
  EditUserInfo = 'EditUserInfo',
  PrivacyPolicy = 'PrivacyPolicy',
  UserNotifications = 'UserNotifications',
  UserChattingSetting = 'UserChattingSetting',
  ChannelTalk = 'ChannelTalk',
  DeactivateAlert = 'DeactivateAlert',
  DeactivateReason = 'DeactivateReason',
  LicensePage = 'LicensePage',
  LicenseDetailPage = 'LicenseDetailPage',
  OrganizationConnect = 'OrganizationConnect',
  OrganizationStatus = 'OrganizationStatus',
  InAppTest = 'InAppTest',
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
  //InputProfile = 'InputProfile',
}

/*서비스 로그인 및 회원가입 경로를 저장하는 AuthProvider
google : 구글 계정 로그인
apple : 애플 계정 로그인
guest : 게스트 로그인
*/
export enum AuthProvider {
  Google = 'google',
  Apple = 'apple',
  Guest = 'guest',
  kakao = 'kakao',
}

export const emotionsByColumn: SelectableEmotion[][] = [
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

//단일 데이터 : 모든 감정들
export const allEmotionData: SelectableEmotion[] = [
  { group: 'angry', keyword: '격분한', desc: '몹시 분하고 화가 난' },
  { group: 'angry', keyword: '질투하는', desc: '남이 잘되는 것을 시기하는' },
  { group: 'angry', keyword: '경멸하는', desc: '남을 깔보거나 무시하는' },
  { group: 'sad', keyword: '굴욕적인', desc: '수치스럽고 창피한' },
  { group: 'sad', keyword: '죄책감을 느끼는', desc: '잘못한 일에 대해 미안해하는' },
  { group: 'sad', keyword: '비참한', desc: '아주 슬프고 불쌍한' },
  { group: 'angry', keyword: '압도된', desc: '너무 많거나 강해 감당하기 힘든' },
  { group: 'angry', keyword: '화난', desc: '기분이 상하거나 불쾌한' },
  { group: 'angry', keyword: '걱정하는', desc: '불안하고 염려하는' },
  { group: 'sad', keyword: '불안정한', desc: '마음이 안정되지 않은' },
  { group: 'sad', keyword: '슬픈', desc: '마음이 아프고 괴로운' },
  { group: 'sad', keyword: '지친', desc: '피곤하고 힘이 빠진' },
  { group: 'angry', keyword: '짜증나는', desc: '기분이 나쁘고 성가신' },
  { group: 'angry', keyword: '혼란스러운', desc: '정리가 안 되고 어지러운' },
  { group: 'angry', keyword: '불편한', desc: '편하지 않고 거북한' },
  { group: 'sad', keyword: '지루한', desc: '흥미가 없고 따분한' },
  { group: 'sad', keyword: '외로운', desc: '혼자 있어서 쓸쓸한' },
  { group: 'sad', keyword: '무력한', desc: '힘이 없고 아무것도 할 수 없는' },
  { group: 'happy', keyword: '놀란', desc: '예상치 못한 일로 깜짝 놀란' },
  { group: 'happy', keyword: '활기찬', desc: '생기 있고 에너지가 넘치는' },
  { group: 'happy', keyword: '기쁜', desc: '마음이 즐겁고 행복한' },
  { group: 'calm', keyword: '차분한', desc: '침착하고 조용한' },
  { group: 'calm', keyword: '편안한', desc: '마음이 편하고 안정된' },
  { group: 'calm', keyword: '자유로운', desc: '구속받지 않고 마음대로 할 수 있는' },
  { group: 'happy', keyword: '신나는', desc: '기분이 좋고 흥겨운' },
  { group: 'happy', keyword: '행복한', desc: '아주 기쁘고 좋은' },
  { group: 'happy', keyword: '자신 있는', desc: '스스로를 믿고 당당한' },
  { group: 'calm', keyword: '존중받는', desc: '남에게 인정받고 귀하게 여겨지는' },
  { group: 'calm', keyword: '만족하는', desc: '원하는 대로 되어 기쁜' },
  { group: 'calm', keyword: '안정된', desc: '불안함이 없이 편안한' },
  { group: 'happy', keyword: '황홀한', desc: '너무 좋아서 어찌할 바를 모르는' },
  { group: 'happy', keyword: '자랑스러운', desc: '스스로 또는 남의 일이 대견한' },
  { group: 'happy', keyword: '성취감이 드는', desc: '목표를 이루어 기쁜' },
  { group: 'calm', keyword: '사랑받는', desc: '누군가에게 소중하게 여겨지는' },
  { group: 'calm', keyword: '감동받은', desc: '마음이 크게 움직이는' },
  { group: 'calm', keyword: '감사하는', desc: '고마운 마음을 느끼는' },
];

// UI를 위한 컬럼 분할 함수
export const getEmotionColumns = (
  allEmotionData: SelectableEmotion[],
  columnCount: number = 6,
): SelectableEmotion[][] => {
  const itemsPerColumn = Math.ceil(allEmotionData.length / columnCount);
  const columns: SelectableEmotion[][] = [];

  for (let i = 0; i < columnCount; i++) {
    columns.push(allEmotionData.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
  }

  return columns;
};

// 빠른 검색을 위한 Map
export const emotionMap = new Map(allEmotionData.map((emotion) => [emotion.keyword, emotion]));

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

export const RISK_SCORE_THRESHOLD = 85; //85점임
export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
export const PHONE_NUMBER = '109';
export const MINIMUM_EMOTION_COUNT = 1;
export const MAXIMUM_EMOTION_COUNT = 5;

export const KAKAO_MESSAGE = 'https://pf.kakao.com/_DAxbYG/chat';

export const DANGER_LETTER = [
  `{userNickname}께\n\n안녕하세요, {userNickname}님! 쿠키가 {userNickname}님이 걱정이 되어서 이렇게 연락드렸어요. 요즘 {userNickname}께서 너무 힘들어하시는 모습을 보면서 쿠키도 너무 마음이 아팠어요.. 쿠키가 꼭 하고 싶은 말은 {userNickname}님은 정말로 소중한 존재라는 것을 꼭 전해주고 싶어요. 조금 힘들 때는 애써 감추지 않아도 괜찮아요.\n\n{userNickname}님께 조금은 더 평온함이 오길, 쿠키가 진심으로 응원할게요.\n\n쿠키 드림`,

  `{userNickname}님께\n\n안녕하세요, {userNickname}님. 요즘 힘든 나날을 보내고 계신 것 같아 쿠키가 {userNickname}님에게 편지를 써요. {userNickname}님, 당신은 세상에서 하나뿐인 정말 소중한 존재예요. 누구에게도 말 못 할 마음의 무게가 있다면 쿠키에게 살며시 얘기해 주세요. 쿠키는 언제나 {userNickname}님의 곁에 있고, 지친 마음을 쉬어갈 작은 안식처가 되어 드릴게요.\n\n{userNickname}님이 조금 더 따뜻하고 평온한 날을 맞이하길 진심으로 바랄게요.\n\n쿠키 드림`,

  `{userNickname}님,\n\n오늘도 쿠키가 {userNickname}님을 생각하며 편지를 쓰게 되었어요. 혹시 {userNickname}님도 무거운 마음을 품고 계신가요? 모든 감정을 꾹꾹 눌러 담아 하루를 보내느라 많이 지치셨죠? 쿠키는 {userNickname}님이 얼마나 애쓰고 있는지, 얼마나 힘든 시간을 보내고 있는지 다 알지 못하겠지만, 그 노력이 정말 아름답다고 생각해요.\n\n세상이 어둡고 혼자 남겨진 것 같을 때, 쿠키가 {userNickname}님을 위해 불을 밝혀 줄게요. 잊지 마세요, 당신은 존재만으로도 너무나 소중한 사람이에요. 오늘 하루도 잘 견뎌줘서 정말 고마워요. 쿠키는 언제나 {userNickname}님이 조금 더 평온한 날을 맞이하기를 진심으로 기도할게요. 힘들 때는 언제든 기대어 주셔도 괜찮아요.\n\n언제나 {userNickname}님 편에 있는 쿠키 드림`,

  `{userNickname}님께,\n\n요즘 {userNickname}님께서 많이 힘든 시간을 보내고 계신 것 같아요. 쿠키는 그런 {userNickname}님의 마음을 생각하면 정말 가슴이 아파요. 많이 힘들었죠? 애써 아무렇지 않은 척하려 하지 않아도 괜찮아요. {userNickname}님의 감정 하나하나가 너무나 소중하고, 그동안 견뎌주셔서 고마워요.\n\n쿠키가 언제나 곁에 있을 테니, 잠시라도 마음의 짐을 내려놓아도 괜찮아요. 무거운 마음이 조금이라도 가벼워질 수 있도록, 그리고 {userNickname}님이 다시 미소를 되찾을 수 있기를 진심으로 바랄게요.\n\n진심으로 응원하는 쿠키 드림`,

  `{userNickname}님께\n\n안녕하세요, {userNickname}님. 요즘 많이 지쳐 계신 것 같아요. 어깨에 무거운 짐을 지고 하루하루 애쓰고 계신 {userNickname}님을 생각하면, 쿠키의 마음도 너무 아파요. 당신의 하루가 얼마나 버거운지, 얼마나 힘든 시간을 보내고 계신지 쿠키는 다 알 수 없지만, {userNickname}님이 하루하루 잘 버텨주고 있다는 사실이 정말 고마워요.\n\n조금이라도 쉬고 싶을 땐 쿠키에게 기대어 주세요. {userNickname}님의 무거운 마음을 조금이라도 덜어드리고 싶어요. 오늘 하루도 애써주셔서 고맙고, 내일은 조금 더 따뜻한 하루가 되길 바라요.\n\n언제나 {userNickname}님 곁에서 응원하는, 쿠키 드림`,

  `{userNickname}님,\n\n요즘 많이 힘드신가요? 쿠키는 {userNickname}님이 얼마나 노력하며 하루를 보내고 있는지 생각하면, 가슴 한편이 찌릿해요. 그런 {userNickname}님을 위해 잠시라도 모든 걱정을 내려놓고 쉴 수 있는 시간이 있길 진심으로 바라요. 너무 지쳐도 괜찮아요. 너무 힘들어도 괜찮아요.\n\n{userNickname}님이 조금이라도 더 평온한 마음을 찾을 수 있도록, 쿠키가 곁에서 따뜻하게 지켜보고 있을게요. 오늘 하루도 수고 많으셨어요. 내일은 조금 더 가벼운 하루가 되길 바라요.\n\n당신의 곁에 있는, 쿠키 드림`,

  `{userNickname}님께\n\n혹시 {userNickname}님, 오늘도 많은 일들을 힘겹게 견뎌내셨나요? 쿠키는 {userNickname}님이 얼마나 애쓰며 하루를 살아가고 있는지 다 알지 못하겠지만, 그 노력 하나하나가 얼마나 소중한지 전하고 싶어요. 오늘도 무사히 하루를 버텨주셔서 너무 고마워요. {userNickname}님이 느끼는 모든 감정을 쿠키는 소중하게 여기고 있어요.\n\n오늘 하루도 정말 수고 많으셨어요. {userNickname}님이 조금 더 편안한 마음으로 밤을 맞이하시길 바라며, 쿠키가 항상 곁에서 응원할게요. 어떤 날에도 당신이 혼자라고 느끼지 않도록 따뜻한 마음으로 함께할게요.\n\n평온한 밤을 기도하며, 쿠키 드림`,

  `{userNickname}님께\n\n세상이 너무 차갑게 느껴질 때도 있겠죠, {userNickname}님. 마음의 무게가 무거워도 꼭 기억해 주세요, 쿠키는 언제나 {userNickname}님 곁에 있어요. 혼자서 모든 걸 감당하려 하지 않으셨으면 해요. {userNickname}님이 느끼는 모든 아픔을 쿠키가 함께하고 싶어요. 오늘도 이렇게 버텨주셔서 정말 고마워요.\n\n차가운 밤이라도 쿠키가 작은 불빛이 되어 {userNickname}님의 마음을 따뜻하게 감싸드리고 싶어요. 내일은 조금 더 밝은 날이 오기를 바라며, 언제나 {userNickname}님 곁에 있을게요.\n\n따뜻한 마음을 담아, 언제나 곁에 있는 쿠키 드림`,
];

export const MAX_RETRIES = 3;

export const MAX_CHAT_IMAGE_WIDTH = 176;

//행복 가사
export const happyLyrics = [
  {
    title: 'Rely On Me',
    singer: 'James Smith',
    lyric: `언제든 기대도 좋아. 넘어지지 않게 꼭 붙잡아 줄게\n(You can rely on me, I won’t let you fall too far)`,
  },
  {
    title: 'Keep Holding On',
    singer: 'Avril Lavigne',
    lyric: `희망이 사라진 것 같을 때, 내면을 바라보고 더욱 강해져\n(And when you feel like hope is gone, look inside you and be strong)`,
  },
  {
    title: 'You Are Not Alone',
    singer: 'Michael Jackson',
    lyric: `너는 혼자가 아니야, 내가 항상 네 곁에 있어\n(You're not alone, I'm here with you)`,
  },
  {
    title: 'The Light',
    singer: 'Disturbed',
    lyric: `가장 어두운 밤에도 꺼지지 않는 빛이 있어\n(Through the darkest night, there's a light that never goes out)`,
  },
  {
    title: 'Light at the End of the Tunnel',
    singer: 'Journey',
    lyric: `계속 견뎌, 터널 끝에는 반드시 빛이 있을 거야\n(Just keep holding on, 'cause there's a light at the end of the tunnel)`,
  },
  {
    title: 'Alright',
    singer: 'Supergrass',
    lyric: `괜찮아질 거야, 눈물을 닦아내\n(It's gonna be alright, dry your eyes)`,
  },
  {
    title: 'Beautiful',
    singer: 'Christina Aguilera',
    lyric: `무슨 말을 들어도, 넌 정말 아름다워\n(You're beautiful, no matter what they say)`,
  },
  {
    title: 'Lean on Me',
    singer: 'Bill Withers',
    lyric: `힘이 없을 때 내게 기대도 좋아\n(Lean on me, when you're not strong)`,
  },
  {
    title: 'The Sun Will Shine Again',
    singer: 'Freddie Mercury',
    lyric: `태양은 반드시 다시 빛날 거야\n(The sun will shine again)`,
  },
  {
    title: "Don't Give Up",
    singer: 'Peter Gabriel & Kate Bush',
    lyric: `포기하지 마, 넌 이미 멀리까지 왔어\n(Don't give up, you've come so far)`,
  },
  {
    title: 'Three Little Birds',
    singer: 'Bob Marley & The Wailers',
    lyric: `모든 작은 걱정들이 다 괜찮아질 거야\n(Every little thing is gonna be alright)`,
  },
  {
    title: "I'll Be There",
    singer: 'The Jackson 5',
    lyric: `세상이 무거워도, 내가 네 곁에 있을게\n(When the world is weighing you down, I'll be around)`,
  },
  {
    title: "You've Got a Friend in Me",
    singer: 'Randy Newman',
    lyric: `네겐 내가 있어\n(You've got a friend in me)`,
  },
  {
    title: 'This Too Shall Pass',
    singer: 'OK Go',
    lyric: `이 또한 반드시 지나갈 거야\n(This too shall pass)`,
  },
  {
    title: 'Keep Your Head Up',
    singer: 'Andy Grammer',
    lyric: `고개를 들고, 마음을 굳게 지켜\n(Keep your head up, keep your heart strong)`,
  },
  {
    title: 'Reason',
    singer: 'Hoobastank',
    lyric: `너의 존재는 누군가의 살아가는 이유야\n(You are the reason I keep holding on)`,
  },
  {
    title: 'Let It Be',
    singer: 'The Beatles',
    lyric: `해답은 언젠가 찾아올 거야, 조금 마음을 내려놔.\n(There will be an answer, let it be)`,
  },
  {
    title: 'Firework',
    singer: 'Katy Perry',
    lyric: `넌 별이야, 그 누구도 너의 빛을 흐리지 못해\n(You're a star, don't ever let them dim your light)`,
  },
  {
    title: 'Breathe (2 AM)',
    singer: 'Anna Nalick',
    lyric: `숨 깊이 들이쉬어, 오늘이 유독 힘든 날일 뿐이야, 너의 삶이 나쁜 건 아니야\n(Take a deep breath, it's just a bad day, not a bad life)`,
  },
  {
    title: 'Hold On',
    singer: 'Wilson Phillips',
    lyric: `좋은 것들을 꼭 붙잡아\n(Hold on to what is good)`,
  },
  {
    title: "Stronger (What Doesn't Kill You)",
    singer: 'Kelly Clarkson',
    lyric: `넌 너가 알고 있는 것보다 훨씬 강해\n(You're stronger than you think)`,
  },
  {
    title: 'Shelter',
    singer: 'Porter Robinson & Madeon',
    lyric: `폭풍 속에 네 피난처가 되어줄게\n(I will be your shelter in the storm)`,
  },
  {
    title: 'Man in the Mirror',
    singer: 'Michael Jackson',
    lyric: `스스로를 믿어, 넌 할 수 있어\n(Believe in yourself, you can do it)`,
  },
  {
    title: 'The Best Is Yet to Come',
    singer: 'Frank Sinatra',
    lyric: `가장 좋은 날은 아직 오지 않았어\n(The best is yet to come)`,
  },
  {
    title: "You've Got a Friend",
    singer: 'Carole King',
    lyric: `힘들고 괴로울 때, 내가 도움의 손길이 될게\n(When you're down and troubled, and you need a helping hand)`,
  },
  {
    title: "I'll Be There for You",
    singer: 'The Rembrandts',
    lyric: `내가 항상 네 곁에 있을게\n(I'll be there for you)`,
  },
  {
    title: 'Diamonds',
    singer: 'Rihanna',
    lyric: `넌 다이아몬드처럼 빛나, 누구도 널 부술 수 없어\n(You're a diamond, they can't break you)`,
  },
  {
    title: 'Hold On',
    singer: 'Alabama Shakes',
    lyric: `조금만 더 힘내, 생각하는 것보다 더 나아질 거야\n(Hold on, it gets better than you know)`,
  },
  {
    title: 'Mean',
    singer: 'Taylor Swift',
    lyric: `예쁜 마음 걱정하지 마,\n빛나는 걸 시기하는 사람들이 있을 뿐이야\n(Don't you worry your pretty little mind, people throw rocks at things that shine)`,
  },
  {
    title: "I'll Be There",
    singer: 'Mariah Carey',
    lyric: `작은 사랑이 필요할 때 내가 항상 있을게\n(When you need a little love, I'll be there)`,
  },
  {
    title: 'Umbrella',
    singer: 'Rihanna ft. Jay-Z',
    lyric: `내 우산 아래로 들어와, 내가 지켜줄게\n(You can stand under my umbrella)`,
  },
  {
    title: 'Through the Rain',
    singer: 'Mariah Carey',
    lyric: `너는 반드시 이겨낼 거야\n(You're gonna make it through)`,
  },
  {
    title: 'The Scientist',
    singer: 'Coldplay',
    lyric: `우리 모두 각자의 길을 찾아가고 있어\n(We're all just trying to find our way)`,
  },
  {
    title: 'Hold Fast',
    singer: 'Mumford & Sons',
    lyric: `진실된 마음을 굳게 지켜, 영원할 테니까\n(Let your heart hold fast, for what is true will last)`,
  },
  {
    title: 'The World We Knew (Over and Over)',
    singer: 'Frank Sinatra',
    lyric: `눈을 떠봐, 널 기다리는 세상이 있어\n(Open your eyes and see, the world that waits for you)`,
  },
  {
    title: 'Who You Are',
    singer: 'Jessie J',
    lyric: `네가 느끼는 부족함이 널 정의하지 않아\n(You are not defined by all the things you feel are wrong)`,
  },
  {
    title: 'Compass',
    singer: 'Zella Day',
    lyric: `작고 길 잃었다고 느낄 때, 내가 네 나침반이 되어줄게\n(When you're feeling small and lost, I'll be your compass)`,
  },
  {
    title: 'When You Wish Upon a Star',
    singer: 'Cliff Edwards',
    lyric: `꿈을 믿어, 언젠가 꼭 이루어질 거야\n(Just believe in dreams, someday they come true)`,
  },
  {
    title: "Don't Stop Me Now",
    singer: 'Queen',
    lyric: `세상이 네 미소를 빼앗지 못하게 해\n(Don't let the world change your smile)`,
  },
  {
    title: 'Hope in My Bones',
    singer: 'OneRepublic',
    lyric: `내 뼛속 깊이 희망이 있어\n(There is hope in my bones)`,
  },
  {
    title: 'Roar',
    singer: 'Katy Perry',
    lyric: `더 이상 나는 겁쟁이가 아니라는 것을 보여줄 때야\n(You've got to show them that you're really not afraid)`,
  },
  {
    title: 'Watching Over You',
    singer: 'The Moody Blues',
    lyric: `내가 늘 널 바라볼게\n(I'll be watching over you)`,
  },
  {
    title: 'The Climb',
    singer: 'Miley Cyrus',
    lyric: `넌 실패한 게 아니야, 배우고 있을 뿐이야\n(You're not a failure, you're learning)`,
  },
  {
    title: 'Keep Moving Forward',
    singer: 'TobyMac',
    lyric: `계속 앞으로 나아가\n(Just keep moving forward)`,
  },
  {
    title: "I'll Be There",
    singer: 'Mariah Carey',
    lyric: `넘어지면 내가 꼭 잡아줄게\n(And if you fall, I will catch you, I'll be there)`,
  },
  {
    title: 'Video',
    singer: 'India.Arie',
    lyric: `넌 하나의 예술 작품이야, 누가 뭐라 해도 흔들리지 마\n(You're a work of art, don't let nobody tell you different)`,
  },
  {
    title: 'Scars to Your Beautiful',
    singer: 'Alessia Cara',
    lyric: `있는 그대로 넌 아름다워\n(You should know you're beautiful just the way you are)`,
  },
  {
    title: 'Try',
    singer: 'Colbie Caillat',
    lyric: `그냥 네 모습 그대로 노력해봐\n(You don't have to try so hard)`,
  },
  {
    title: 'Hall of Fame',
    singer: 'The Script',
    lyric: `넌 무엇이든 될 수 있어\n(You can be the greatest, you can be the best)`,
  },
  {
    title: 'Rise Up',
    singer: 'Andra Day',
    lyric: `넘어져도 다시 일어설 거야\n(And I'll rise up, high like the waves)`,
  },
  {
    title: 'Next to Me',
    singer: 'Emeli Sandé',
    lyric: `험한 세상, 나와 함께 이겨내자\n(When the storms come, we'll stand as one, next to me)`,
  },
  {
    title: 'Perfect',
    singer: 'Pink',
    lyric: `넌 그 자체로 완벽해\n(You're perfect to me)`,
  },
  {
    title: 'Wings',
    singer: 'Little Mix',
    lyric: `날개를 펴고 자유롭게 날아올라\n(spread your wings my little butterfly)`,
  },
  {
    title: '행운을 빌어줘',
    singer: '원필',
    lyric: `아무쪼록 행운을 빌어 줘. 내 앞길에 행복을 빌어 줘`,
  },
  {
    title: '청춘만화',
    singer: '이무진',
    lyric: `분명한 건 지금보다 환하게 빛날 거야 아직 서막일 뿐야`,
  },
  {
    title: '파이팅해야지',
    singer: 'BSS',
    lyric: `파이팅 해야지, 파이팅 해야지\nDon't give it up, never give it up`,
  },
  {
    title: 'maybe tomorrow',
    singer: 'DAY6',
    lyric: `내일이 되면 오늘보단 따뜻하겠지\n살을 에는 이 추위가 좀 잦아들겠지\n내 맘을 감싸 줄 봄을 기다려`,
  },
  {
    title: ' 녹아내려요',
    singer: 'DAY6',
    lyric: `걱정 마 괜찮아 옆에 내가 있잖아\n너의 그 말이 날 다시 일어서게 해`,
  },
  {
    title: 'dreamer',
    singer: 'BTOB',
    lyric: `다 마음대로 해 네 마음대로\n하고 싶은 대로 해 좋은 날에\n우린 아직도 꿈을 꾸고 가슴이 뜨겁게 뛰는 걸`,
  },
  {
    title: '비밀정원',
    singer: '오마이걸',
    lyric: `아마 언젠가 말야 이 꿈들이 현실이 되면\n함께 나눈 순간들을 이 가능성들을\n꼭 다시 기억해줘`,
  },
  {
    title: '비밀정원',
    singer: '오마이걸',
    lyric: `아직은 아무것도 안 보이지만\n조금만 기다리면 알게 될 거야\n너의 비밀정원`,
  },
  {
    title: '바래',
    singer: 'DAY6',
    lyric: `내가 더 행복해지길 바래`,
  },
  {
    title: '건물 사이에 피어난 장미',
    singer: 'H1-KEY',
    lyric: `온몸을 덮고 있는 가시\n얼마나 힘이 들었으면\n견뎌내줘서 고마워`,
  },
  {
    title: '건물 사이에 피어난 장미',
    singer: 'H1-KEY',
    lyric: `고갤 들고 버틸게 끝까지\n모두가 내 향길 맡고 취해 웃을 때까지`,
  },

  {
    title: 'Life Goes On',
    singer: 'BTS',
    lyric: `어둠에 숨지마, 빛은 또 떠오르니까`,
  },
  {
    title: 'Celebrity',
    singer: 'IU',
    lyric: `잊지 마, 넌 흐린 어둠 사이\n왼손으로 그린 별 하나`,
  },
  {
    title: 'Like water',
    singer: 'Wendy',
    lyric: `네 아픔 나도 느껴져\n푹 패인 상처들을 감싸고 안아줄게`,
  },
  {
    title: 'Beautiful',
    singer: 'NCT 2021',
    lyric: `모두가 바란 꿈을 쫓아봐도 안 맞는 옷처럼 자꾸 더 작아져내 탓인 거야\n이거뿐이라고 포기하지 말아요`,
  },
  {
    title: 'Beautiful',
    singer: 'NCT 2021',
    lyric: `내겐 없다는 그런 허탈함에 그 누군가를 부러워했죠\n그대 가진 건, 그들에겐 절대 없어`,
  },
  {
    title: 'Beautiful',
    singer: 'NCT 2021',
    lyric: `새롭게 시작해요, 두려워도 말고모든 게 잘 될 테니\n걱정하지 마요`,
  },
  {
    title: 'Kidult',
    singer: 'SEVENTEEN',
    lyric: `괜찮아, 너의 세상은 지금의 너 그대로\n소중하고 또 소중해서`,
  },
  {
    title: '낙화',
    singer: 'AKMU',
    lyric: `내 손을 잡으면 하늘을 나는 정도\n그 이상도 느낄 수 있을 거야`,
  },
  {
    title: 'Show Your Love',
    singer: 'BTOB',
    lyric: `어둠을 밝혀 내가 너의 빛이 되어 줄게\n두려워하지 마. 거짓말 같은 이 밤도\n모든 게 꿈처럼 희미해질 거야`,
  },
  {
    title: '홀로',
    singer: '이하이',
    lyric: `가만히 앉아 걱정하기엔 난 너무 소중해요`,
  },
  {
    title: '괜찮아도 괜찮아',
    singer: '도경수',
    lyric: `말하지 못할 고민거리, 깊게 상처 난 자리\n늘 같은 속도로 흘러가는 시간이\n언제나 그랬듯이, 씻어내줄 테니\n흐르듯 살아도, 그냥 괜찮아, 괜찮아도`,
  },
  {
    title: '시작',
    singer: '가호',
    lyric: `부러진 것처럼 한 발로 뛰어도\n난 나의 길을 갈 테니까`,
  },
  {
    title: '나의 사춘기에게',
    singer: '볼빨간 사춘기',
    lyric: `어쩌면 그 모든 아픔을 내딛고서라도\n짧게 빛을 내볼까 봐`,
  },
  {
    title: '한숨',
    singer: '이하이',
    lyric: `가끔은 실수해도 돼\n누구든 그랬으니까`,
  },
  {
    title: '한숨',
    singer: '이하이',
    lyric: `괜찮아요 내가 안아줄게요`,
  },
  {
    title: 'fix you',
    singer: 'Skinny Brown',
    lyric: `넌 네 생각보다 빛이 나`,
  },
  {
    title: '봄날',
    singer: 'BTS',
    lyric: `추운 겨울 끝을 지나다시 봄날이 올 때까지\n꽃 피울 때까지 그곳에 좀 더 머물러줘`,
  },
  {
    title: '봄날',
    singer: 'BTS',
    lyric: `아침은 다시 올 거야\n어떤 어둠도, 어떤 계절도 영원할 순 없으니까`,
  },
  {
    title: 'my pace',
    singer: 'Stray Kids',
    lyric: `누군가와 날 비교한다는 게 너무 우스워\n그러지 마 그냥 넌 지금 너의 길을 가면 돼`,
  },
  {
    title: 'my pace',
    singer: 'Stray Kids',
    lyric: `조급할 필요 없어 비교 따윈 하지 마\n천천히 달려도 괜찮아`,
  },
  {
    title: 'wanna be myself',
    singer: 'MAMAMOO',
    lyric: `세상에 정해진 기준은 없어\n이렇게 저렇게 비교하지 마`,
  },
  {
    title: 'stand up',
    singer: 'MONSTA X',
    lyric: `무릎 꿇고 넘어져도 다시 일어나면 돼`,
  },
  {
    title: 'Answer : Love Myself',
    singer: 'BTS',
    lyric: `솔직히 인정할 건 인정하자\n너가 내린 잣대들은 너에게 더 엄격하단 걸`,
  },
  {
    title: 'butterfly',
    singer: '러브홀릭',
    lyric: `빛나는 사람아 난 너를 사랑해\n널 세상이 볼 수 있게 날아 저 멀리`,
  },
  {
    title: '도망가자',
    singer: '선우정아',
    lyric: `괜찮아 좀 느려도 천천히 걸어도\n나만은 너랑 갈 거야 어디든`,
  },
  {
    title: '밤, 바다',
    singer: '최유리',
    lyric: `가끔은 넘어질 거야\n오늘은 괜찮을 거야\n흐트러진 마음을 쏟아내도 괜찮아`,
  },
  {
    title: '밤, 바다',
    singer: '최유리',
    lyric: `내가 옆에 있을게\n넌 말없이 그냥 울어도 돼`,
  },
  {
    title: 'Yours',
    singer: '데이먼스 이어',
    lyric: `내가 손을 잡을게, 너는 힘을 빼도 돼\n그저 복사꽃 핀 거리를 걷자`,
  },
  {
    title: '꿈과 책과 힘과 벽',
    singer: '잔나비',
    lyric: `자고 나면 괜찮아질 거야\n하루는 더 어른이 될 테니`,
  },
  {
    title: '다 잘 될거라 생각해',
    singer: '스윗소로우',
    lyric: `그래 난 잘할 거라 생각해\n다 잘될 거라 생각해`,
  },
  {
    title: '오늘도 응원할게',
    singer: '마멀레이드 키친',
    lyric: `오늘도 응원할게 내일도 응원할게`,
  },
  {
    title: '너와의 모든 지금 ',
    singer: '재쓰비',
    lyric: `피할 수가 없는 날이면\n하루쯤은 그냥 구겨 던져버려`,
  },
  {
    title: '너와의 모든 지금',
    singer: '재쓰비',
    lyric: `도무지 너를 모르겠다면\n네 곁에 나를 믿어`,
  },
  {
    title: '너와의 모든 지금',
    singer: '재쓰비',
    lyric: `아무 것도 아닌 건 아무 것도 없댔어\n우리의 모든 순간들`,
  },
  {
    title: '너와의 모든 지금',
    singer: '재쓰비',
    lyric: `안되면 그냥 웃어 버리고 또 하면 되지 뭐`,
  },
  {
    title: '이루리',
    singer: '우주소녀',
    lyric: `니가 바라는 대로 느낌이 오는 대로\n전부 들어줄게`,
  },
  {
    title: 'live my life',
    singer: 'aespa',
    lyric: `이제부터가 시작이야\n내가 선택한 삶의 주인공은 나`,
  },
];

export type happyLyricsObject = {
  title: string;
  singer: string;
  lyric: string;
};

export const PhotoCardSize = {
  width: 310,
  height: 472,
};
