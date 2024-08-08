import styled from '@emotion/native';
import { rsHeight } from '../../../../utils/responsive-size';

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  gap: ${rsHeight * 10 + 'px'};
  padding-top: ${rsHeight * 20 + 'px'};
  margin-bottom: ${rsHeight * 40 + 'px'};
`;
