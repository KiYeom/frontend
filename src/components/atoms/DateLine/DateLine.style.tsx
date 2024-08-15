import styled from '@emotion/native';
import { rsHeight, rsWidth, rsFont } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';

export const TouchableDateLine = styled.TouchableOpacity`
  gap: ${rsWidth * 4 + 'px'};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: auto;
  flex-shrink: 1;
`;

export const DateLineText = styled.Text`
  font-family: Pretendard-Medium;
  font-size: ${14 * rsFont + 'px'};
  color: ${palette.neutral[500]};
`;
