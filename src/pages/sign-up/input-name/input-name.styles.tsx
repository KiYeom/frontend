import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const TitleContainer = styled.View`
  height: ${rsHeight * 147 + 'px'};
  gap: ${rsHeight * 10 + 'px'};
  padding: ${rsHeight * 40 + 'px'} ${rsWidth * 24 + 'px'} 0 ${rsWidth * 24 + 'px'};
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
  font-size: ${rsFont * 30 + 'px'};
  font-family: Pretendard-SemiBold;
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

  padding: ${rsHeight * 40 + 'px'} ${rsWidth * 24 + 'px'};
`;

export const TermsContainer = styled.View`
  gap: ${rsHeight * 20 + 'px'};
  padding: ${rsHeight * 0 + 'px'} ${rsWidth * 24 + 'px'};
`;

export const AlertMessage = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-Regular;
  color: ${palette.neutral[400]};
`;
