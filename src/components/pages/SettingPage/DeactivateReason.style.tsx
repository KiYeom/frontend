import palette from '../../../assets/styles/theme';
import styled from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const CheckboxContainer = styled.View`
  flex: 1;
  gap: ${rsHeight * 16 + 'px'};
  padding-top: ${rsHeight * 40 + 'px'};
`;
