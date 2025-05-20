import styled from '@emotion/native';
import { EdgeInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export const Container = styled.TouchableOpacity`
  flex: 1;
  background-color: ${palette.neutral[50]};
  border-radius: ${rsWidth * 10 + 'px'};
  border-width: 2px;
  border-color: ${palette.primary[500]};
  border-style: dashed;
  justify-content: center;
  align-items: center;
  gap: ${rsHeight * 5 + 'px'};
`;

export const ContainerText = styled.Text`
  font-size: ${rsFont * 13 + 'px'};
  font-family: Kyobo-handwriting;
  text-align: center;
`;

export const UnderlineText = styled.Text`
  text-decoration: underline;
`;
