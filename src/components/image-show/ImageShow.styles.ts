import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import { Image } from 'react-native';

export const ImageShowContainer = styled.View`
  //background-color: rgba(0, 0, 0, 0.4);
  border-top: 1px solid black;
  //background-color: pink;
  position: relative;
  padding-horizontal: ${rsWidth * 10 + 'px'};
  padding-vertical: ${rsHeight * 10 + 'px'};
  justify-content: center;
  align-items: center;
`;

export const CancelButton = styled.TouchableOpacity`
  //background-color: red;
  width: ${rsWidth * 14 + 'px'};
  height: ${rsHeight * 14 + 'px'};
  position: absolute;
  padding: ${rsWidth * 10 + 'px'};
  top: 10px;
  right: 10px;
  justify-content: center;
  align-items: center;
`;
