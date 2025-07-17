import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';

export const SwitchRowContainer = styled.View`
  width: 100%;
  padding-horizontal: ${rsWidth * 20 + 'px'};
  padding-vertical: ${rsHeight * 16 + 'px'};
  flex-direction: row;
  gap: ${rsWidth * 8 + 'px'};
`;

export const SwitchRowTextContainner = styled.View`
  flex: 1;
  justify-content: start;
  align-items: left;
  gap: ${rsHeight * 6 + 'px'};
`;

export const SwitchRowTitle = styled.Text`
  font-size: ${rsWidth * 16 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.neutral[900]};
`;

export const SwitchRowDesc = styled.Text`
  font-size: ${rsWidth * 12 + 'px'};
  font-family: Pretendard-Regular;
  color: ${palette.neutral[400]};
`;
