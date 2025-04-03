/** @jsxImportSource @emotion/react */
import React from 'react';
import { Text } from 'react-native';
import styled from '@emotion/native';
import { rsFont, rsWidth, rsHeight } from '../../utils/responsive-size';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: yellow;
  padding: 0;
  /* Changed justify-content from center to flex-start */
  justify-content: flex-start;
`;

export const MessageText = styled.Text`
  font-size: ${14 * rsFont + 'pz'};
`;
