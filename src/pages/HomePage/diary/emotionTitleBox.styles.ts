import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const EmotionMainTitle = styled.Text`
  font-size: ${rsFont * 20 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.neutral[900]};
`;

export const EmotionSubTitle = styled.Text`
  font-size: ${rsFont * 14 + 'px'};
  font-family: Pretendard-Regular;
  color: ${palette.neutral[500]};
`;

export const EmotionTextContainer = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${rsHeight * 6 + 'px'};
`;

export const EmotionTitleContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${rsWidth * 12 + 'px'};
  padding-horizontal: ${rsWidth * 12 + 'px'};
`;
