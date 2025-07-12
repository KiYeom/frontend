import styled, { css } from '@emotion/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { rsWidth, rsHeight, rsFont } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

export const Container = styled.TouchableOpacity<{ onPress: () => void }>`
  background-color: #dcdcdc;
  border-radius: 10px;
  max-width: ${350 * rsWidth + 'px'};
  flex-direction: row;
  padding-horizontal: ${rsWidth * 12 + 'px'};
  padding-vertical: ${rsHeight * 12 + 'px'};
  gap: ${rsWidth * 8 + 'px'};
  justify-content: center;
  align-items: center;
`;

export const IconContainer = styled.View`
  background-color: white;
  width: ${rsWidth * 50 + 'px'};
  height: ${rsHeight * 50 + 'px'};
  border-radius: ${rsHeight * 25 + 'px'};
  justify-content: center;
  align-items: center;
`;

export const TextContainer = styled.View`
  flex: 1;
  gap: ${rsHeight * 7 + 'px'};
`;

export const MainTitle = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;

export const SubTitle = styled.Text`
  font-family: Pretendard-Regular;
  font-size: ${14 * rsFont + 'px'};
`;
