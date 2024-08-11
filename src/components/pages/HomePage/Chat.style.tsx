import styled from '@emotion/native';
import { rsFont, rsWidth, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
export const ChatContainer = styled.View`
  flex: 1;
  padding-horizontal: ${rsWidth * 20 + 'px'};
`;

export const TextInputContainer = styled.View`
  padding-horizontal: ${rsWidth * 20 + 'px'};
  padding-vertical: ${rsHeight * 8 + 'px'};
`;

export const DateLine = styled.View`
  flex: 1;
  padding-horizontal: ${rsWidth * 10 + 'px'};
  padding-top: ${rsHeight * 20 + 'px'};
  padding-bottom: ${rsHeight * 8 + 'px'};
  margin-bottom: ${rsHeight * 20 + 'px'};
  justify-content: center;
  align-items: center;
`;
