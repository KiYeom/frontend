import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const TitleContainer = styled.View`
  height: ${rsHeight * 147 + 'px'};
  gap: ${rsHeight * 10 + 'px'};
  padding: ${rsHeight * 20 + 'px'} ${rsWidth * 24 + 'px'} 0 ${rsWidth * 24 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const TitleTextContainter = styled.View`
  gap: ${rsHeight * 10 + 'px'};
  display: flex;
  flex-direction: column;
`;

export const Annotation = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.primary[400]};
`;

export const Description = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.neutral[500]};
`;

export const Title = styled.Text`
  font-size: ${rsFont * 25 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.neutral[900]};
`;

export const SubTitle = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-Medium;
  color: ${palette.neutral[900]};
`;
export const CTAContainer = styled.View`
  height: ${rsHeight * 136 + 'px'};
  display: flex;
  justify-content: center;
  padding: 0 ${rsWidth * 24 + 'px'};
`;

export const ContentContainer = styled.View`
  flex: 1;
  gap: ${rsHeight * 32 + 'px'};
  padding: ${rsHeight * 20 + 'px'} ${rsWidth * 24 + 'px'};
  //background-color: pink;
`;

export const SubContentContainer = styled.View`
  flex: 1;
  gap: ${rsHeight * 10 + 'px'};
  //background-color: yellow;
`;

export const TermsContainer = styled.View`
  padding: ${rsHeight * 20 + 'px'} ${rsWidth * 24 + 'px'};
  gap: ${rsHeight * 15 + 'px'};
  //background-color: orange;
`;

export const AlertMessage = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-Regular;
  color: ${palette.neutral[400]};
`;

export const ButtonGroupContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: ${rsWidth * 20 + 'px'};
`;
