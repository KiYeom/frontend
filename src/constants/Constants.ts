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
