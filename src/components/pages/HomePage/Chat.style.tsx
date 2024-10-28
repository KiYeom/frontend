import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

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

export const DateLineText = styled.Text`
  text-align: center;
  font-size: ${12 * rsFont + 'px'};
  font-family: Pretendard-Regular;
  color: ${palette.neutral[400]};
`;
