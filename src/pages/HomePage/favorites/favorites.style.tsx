/** @jsxImportSource @emotion/react */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: ${palette.neutral[50]};
`;

export const TitleContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: red;
  gap: ${rsHeight * 10 + 'px'};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-family: Kyobo-handwriting;
  //background-color: yellow;
  justify-content: center;
  text-align: center;
`;

export const TitleImage = styled.Image`
  width: 100px;
  height: 100px;
`;
