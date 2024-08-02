import React from 'react';
import palette from '../../assets/styles/theme';
import styled from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const Container = styled.View`
  gap: ${rsHeight * 20 + +'px'};
`;
