import styled from '@emotion/native';
import { rsHeight } from '../../utils/responsive-size';

export const BottomCotainer = styled.View`
  height: ${rsHeight * 90 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: 'yellow';
`;
