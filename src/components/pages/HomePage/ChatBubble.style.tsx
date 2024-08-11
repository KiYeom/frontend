import styled from '@emotion/native';

import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

//채팅 말풍선 전체 컨테이너
export const Container = styled.View<{ status: 'bot' | 'user' }>`
  flex-direction: row;
  gap: ${rsHeight * 8 + 'px'};
  justify-content: ${(props) => (props.status === 'bot' ? 'flex-end' : 'flex-start')};
`;

//채팅 말풍선
export const Bubble = styled.View<{ status: 'bot' | 'user' }>`
  padding-horizontal: ${rsWidth * 12 + 'px'};
  padding-vertical: ${rsHeight * 8 + 'px'};
  flex-shrink: 1;
  min-width: ${(props) =>
    props.status === 'bot' ? rsWidth * 55 + 'px' : undefined}; //봇이 아무말도 안할 때
  min-height: ${(props) =>
    props.status === 'bot' ? rsHeight * 40 + 'px' : undefined}; //봇이 아무말도 안할 때
  border-radius: 10px;
  max-width: ${rsWidth * 200 + 'px'};
  background-color: ${(props) =>
    props.status === 'bot' ? palette.neutral[100] : palette.primary[500]};
`;

//채팅 말풍선 안에 글자
export const BubbleText = styled.Text<{
  status: 'bot' | 'user' | 'time' | 'date';
}>`
  font-size: ${(props) =>
    props.status === 'time' ? `${rsFont * 10 + 'px'}` : `${rsFont * 12 + 'px'}`};
  font-family: Pretendard-Regular;
  color: ${(props) =>
    props.status === 'bot'
      ? palette.neutral[500]
      : props.status === 'user'
        ? '#fff'
        : palette.neutral[400]};
  text-align: ${(props) => (props.status === 'date' ? 'center' : 'left')};
`;

//채팅 말풍선과 시간을 저장하는 말풍선 컨테이너
export const ChatBubbleContainer = styled.View<{ status: 'bot' | 'user' }>`
  flex: 1;
  justify-content: ${(props) => (props.status === 'bot' ? 'flex-start' : 'flex-end')};
  flex-direction: row;
  align-items: flex-end;
  gap: ${rsHeight * 8 + 'px'};
`;

//챗봇 프사 컨테이너
export const ProfileImageContainer = styled.View`
  width: ${rsWidth * 35 + 'px'};
`;
