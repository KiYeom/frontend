import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';

export const TextAreaField = styled.TextInput`
  border-radius: 10px;
  height: ${rsHeight * 120 + 'px'};
  background-color: #f6f6f6;
  padding-horizontal: ${rsWidth * 18 + 'px'};
  padding-vertical: ${rsHeight * 18 + 'px'};
  placeholder-textcolor: ${palette.neutral[300]};
  placeholder-textcolor: ${palette.neutral[300]};
`;

export const TextAreaContainer = styled.View`
  flex: 1;
  padding-top: ${rsHeight * 16 + 'px'};
`;
