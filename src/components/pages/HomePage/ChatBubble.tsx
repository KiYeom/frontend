import {
  Bubble,
  BubbleText,
  ProfileImageContainer,
  Container,
  ChatBubbleContainer,
} from './ChatBubble.style';
import { useAssets } from 'expo-asset';
import { useState } from 'react';
import { Image } from 'expo-image';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { TypingAnimation } from 'react-native-typing-animation';
import { chatting } from '../../../apis/chatting';
type ChatBubbleProps = {
  status: 'user' | 'bot';
  text: string;
  time?: string;
  userText?: string | undefined;
  isLoading?: boolean;
};

const ChatBubble = (props: ChatBubbleProps) => {
  const { status, text, time } = props;
  //const [assets, error] = useAssets([require('../../../assets/images/CookieProfile.png')]);
  //console.log('출력ㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱ', isLoading);
  return (
    <Container status={status}>
      {status === 'bot' && (
        <ProfileImageContainer>
          <Image
            source={require('../../../assets/images/CookieProfile.png')}
            style={{ objectFit: 'contain', width: 35 * rsWidth, height: 35 * rsHeight }}
          />
        </ProfileImageContainer>
      )}
      {status === 'bot' ? (
        <ChatBubbleContainer status={status}>
          <Bubble status={status}>
            {text === '' ? <TypingAnimation /> : <BubbleText status={status}>{text}</BubbleText>}
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
