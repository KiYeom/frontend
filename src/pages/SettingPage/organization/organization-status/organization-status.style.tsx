import styled from '@emotion/native';
import palette from '../../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../../utils/responsive-size';

export const TitleContainer = styled.View`
  gap: ${rsHeight * 10 + 'px'};
  padding: ${rsHeight * 40 + 'px'} ${rsWidth * 24 + 'px'} 0 ${rsWidth * 24 + 'px'};
`;

export const Annotation = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.primary[400]};
`;

export const Title = styled.Text<{ status: 'default' | 'color' }>`
  font-size: ${rsFont * 30 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${(props) => (props.status === 'default' ? palette.neutral[900] : palette.primary[500])};
`;

export const Desc = styled.Text`
  font-size: ${rsFont * 22 + 'px'};
  font-family: Pretendard-Regular;
  color: ${palette.neutral[900]};
`;

export const AlertText = styled.Text`
  font-size: ${rsFont * 14 + 'px'};
  color: ${palette.neutral[300]};
  text-align: center;
`;

export const CTAContainer = styled.View`
  height: ${rsHeight * 136 + 'px'};
  display: flex;
  justify-content: center;
  padding: 0 ${rsWidth * 24 + 'px'};
`;
