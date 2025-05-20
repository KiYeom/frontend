import React from 'react';
import { rsWidth, rsHeight, rsFont } from '../../utils/responsive-size';
import { View } from 'react-native';
import styled from '@emotion/native';
import { EdgeInsets } from 'react-native-safe-area-context';

export const StreakContainer = styled.View`
  flex-direction: row;
  gap: ${rsHeight * 10 + 'px'};
`;

export const Container = styled.View<{ insets: EdgeInsets }>`
  flex: 1;
  padding-top: ${(props) => props.insets.top + 'px'};
`;
