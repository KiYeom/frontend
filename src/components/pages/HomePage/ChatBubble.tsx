import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native';
import { TypingAnimation } from 'react-native-typing-animation';
import palette from '../../../assets/styles/theme';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import Analytics from '../../../utils/analytics';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import {
  Bubble,
  BubbleText,
  ChatBubbleContainer,
  Container,
  ProfileImageContainer,
} from './ChatBubble.style';

type ChatBubbleProps = {
  status: 'user' | 'bot';
  text: string;
  time?: string;
  userText?: string | undefined;
  isLoading?: boolean;
  navigation?: any;
};

const ChatBubble = (props: ChatBubbleProps) => {
  const { status, text, time, navigation } = props;
  return (
    <Container status={status} style={{ backgroundColor: 'transparent' }}>
      {status === 'bot' && (
        <ProfileImageContainer>
          <TouchableOpacity
            onPress={() => {
              Analytics.clickChatCharacterAvatar();
              navigation.navigate(RootStackName.HomeStackNavigator, {
                screen: HomeStackName.Profile,
              });
            }}>
            <Image
              source={require('../../../assets/images/cookieprofile.png')}
              style={{ objectFit: 'contain', width: 35 * rsWidth, height: 35 * rsHeight }}
            />
          </TouchableOpacity>
        </ProfileImageContainer>
      )}
      {status === 'bot' ? (
        <ChatBubbleContainer status={status}>
          <Bubble status={status}>
            {text === '' ? (
              <TypingAnimation
                dotColor={palette.neutral[400]} // 점 색상
                dotMargin={8 * rsWidth} // 점 사이 간격
                dotAmplitude={5} // 점 이동 크기
                dotSpeed={0.15} // 애니메이션 속도
                dotRadius={3 * rsHeight} // 점 크기
              />
            ) : (
              <BubbleText status={status}>{text}</BubbleText>
            )}
          </Bubble>
          <BubbleText status="time">{time}</BubbleText>
        </ChatBubbleContainer>
      ) : (
        <ChatBubbleContainer status={status}>
          <BubbleText status="time">{time}</BubbleText>
          <Bubble status={status}>
            <BubbleText status={status}>{text}</BubbleText>
          </Bubble>
        </ChatBubbleContainer>
      )}
    </Container>
  );
};
export default ChatBubble;
