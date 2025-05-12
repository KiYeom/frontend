import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const TitleContainer = styled.View`
  height: ${rsHeight * 147 + 'px'};
  gap: ${rsHeight * 10 + 'px'};
  padding: ${rsHeight * 40 + 'px'} ${rsWidth * 24 + 'px'} 0 ${rsWidth * 24 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  //background-color: yellow;
`;

export const TitleTextContainter = styled.View`
  gap: ${rsHeight * 5 + 'px'};
  display: flex;
  flex-direction: column;
  //background-color: yellow;
  flex: 1;
`;
export const Annotation = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.primary[400]};
`;

export const Title = styled.Text`
  font-size: ${rsFont * 30 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.neutral[900]};
`;
