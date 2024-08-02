import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const BottomCotainer = styled.View`
  height: ${rsHeight * 90 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: 'yellow';
`;
