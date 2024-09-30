import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsHeight } from '../../../utils/responsive-size';

export const Homeheader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${rsHeight * 60 + 'px'};
`;

export const ProfileButton = styled.TouchableOpacity`
  background-color: ${palette.primary[500]};
`;
