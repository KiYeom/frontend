import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import styled from '@emotion/native';

export const CardContainer = styled.View`
  height: ${rsHeight * 100 + 'px'};
  width: ${rsWidth * 100 + 'px'};
  background-color: white;
  border-radius: 10px;
  border: 1px solid ${palette.neutral[100]};
  align-items: center;
  justify-content: space-evenly;
`;
export const EmotionText = styled.Text`
  font-family: Pretendard-Medium;
  font-size: ${rsFont * 14 + 'px'};
  color: ${palette.neutral[900]};
  text-align: center;
  margin-top: ${rsHeight * 4 + 'px'};
`;
