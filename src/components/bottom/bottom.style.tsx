import styled from '@emotion/native';
import { rsHeight, rsWidth } from '../../utils/responsive-size';

export const BottomCotainer = styled.View`
  display: flex;
  height: ${rsHeight * 90 + 'px'};
  padding-horizontal: ${rsWidth * 60 + 'px'};
  padding-vertical: ${rsHeight * 16 + 'px'};
  flex-direction: row;
  justify-content: space-between;
  align-items: top;
  //justify-content: flex-end;
  //align-items: center;
  //background-color: pink;
`;
