import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const ActionButtonContainer = styled.TouchableOpacity`
  width: auto;
  height: ${rsHeight * 40 + 'px'};
  border-radius: ${rsHeight * 30 + 'px'};
  background-color: ${palette.neutral[50]};
  justify-content: center;
  align-items: center;
  margin: ${rsHeight * 10 + 'px'} ${rsWidth * 10 + 'px'};
  gap: ${rsWidth * 5 + 'px'};
  flex-direction: row;
  padding-horizontal: ${rsWidth * 10 + 'px'};
`;

export const ActionButtonText = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Medium;
  color: ${palette.neutral[500]};
  text-align: center;
`;

export const ActionButtonIconContainer = styled.View`
  width: ${rsWidth * 20 + 'px'};
  height: ${rsHeight * 20 + 'px'};
  justify-content: center;
  align-items: center;
  //background-color: ${palette.neutral[100]};
`;
