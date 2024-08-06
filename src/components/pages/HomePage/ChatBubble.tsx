import {
  Bubble,
  BubbleText,
  ProfileImageContainer,
  ProfileImage,
  Container,
  ChatBubbleContainer,
} from './ChatBubble.style';

type ChatBubbleProps = {
  status: 'user' | 'bot';
  text: string;
  time: string;
};
const ChatBubble = (props: ChatBubbleProps) => {
  const { status, text, time } = props;
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
