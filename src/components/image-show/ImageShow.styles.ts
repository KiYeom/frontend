import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const ImageShowContainer = styled.View`
  background-color: black;
  opacity: 0.5;
  width: ${rsWidth * 200 + 'px'};
  height: 100;
  position: relative;
  padding-horizontal: ${rsWidth * 30 + 'px'};
  padding-vertical: ${rsHeight * 30 + 'px'};
`;

export const CancelButton = styled.TouchableOpacity`
  background-color: red;
  width: ${rsWidth * 14 + 'px'};
  height: ${rsHeight * 14 + 'px'};
  position: absolute;
  top: 10;
  right: 10;
`;
