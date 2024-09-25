import styled from '@emotion/native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';

export const HomeContainer = styled.View<{ insets: EdgeInsets }>`
  flex: 1;
  align-items: start;
  padding-horizontal: ${rsWidth * 20 + 'px'};
  padding-top: ${({ insets }) => insets.top + rsHeight * 54 + 'px'};
  padding-bottom: ${rsHeight * 40 + 'px'};
  gap: ${rsHeight * 30 + 'px'};
`;
