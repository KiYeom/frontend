import styled from '@emotion/native';
import { rsFont, rsWidth, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import {
  Bubble,
  BubbleText,
  ProfileImageContainer,
  ProfileImage,
  Container,
  TimeText,
  ChatBubbleContainer,
} from './ChatBubble.style';
import { ImageContainer } from '../sign-in/sing-in.styles';

type ChatBubbleProps = {
  showImage?: boolean;
  status?: 'user' | 'bot';
  text?: string;
};
const ChatBubble = (props: ChatBubbleProps) => {
  const { showImage = false, status = 'user', text = 'default' } = props;
  return (
    <Container status={status}>
      {status === 'bot' && (
        <ProfileImageContainer>
          <ProfileImage source={require('../../../assets/images/CookieProfile.png')} />
        </ProfileImageContainer>
      )}
      {status === 'bot' ? (
        <ChatBubbleContainer status={status}>
          <Bubble status={status}>
            <BubbleText status={status}>{text}</BubbleText>
          </Bubble>
          <TimeText>오후 쿠키:쿠키</TimeText>
        </ChatBubbleContainer>
      ) : (
        <ChatBubbleContainer status={status}>
          <TimeText>오전 은서:은서</TimeText>
          <Bubble status={status}>
            <BubbleText status={status}>{text}</BubbleText>
          </Bubble>
        </ChatBubbleContainer>
      )}
    </Container>
  );
};
export default ChatBubble;
