import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const ActionButtonContainer = styled.TouchableOpacity`
  width: ${rsWidth * 212 + 'px'};
  height: ${rsHeight * 40 + 'px'};
  border-radius: ${rsHeight * 30 + 'px'};
  background-color: ${palette.primary[500]};
  justify-content: center;
  align-items: center;
  margin: ${rsHeight * 10 + 'px'} ${rsWidth * 10 + 'px'};
  gap: ${rsWidth * 5 + 'px'};
`;

export const ActionButtonText = styled.Text`
  font-size: ${rsFont * 16 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.neutral[100]};
  text-align: center;
  line-height: ${rsHeight * 20 + 'px'};
  padding: ${rsHeight * 5 + 'px'} ${rsWidth * 10 + 'px'};
  text-align: center;
`;

export const ActionButtonIconContainer = styled.View`
  width: ${rsWidth * 20 + 'px'};
  height: ${rsWidth * 20 + 'px'};
  justify-content: center;
  align-items: center;
  background-color: ${palette.neutral[100]};
`;
