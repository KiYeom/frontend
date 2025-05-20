import React from 'react';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import styled from '@emotion/native';

export const ImageContainer = styled.View`
  padding-horizontal: ${rsWidth * 24 + 'px'};
  height: 120px;
  background-color: pink;
  padding-vertical: ${rsHeight * 10 + 'px'};
`;
