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
  padding-horizontal: ${rsWidth * 20 + 'px'};
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

export const SectionComponent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: pink;
  border-radius: 10px;
  padding-horizontal: 20px;
  padding-vertical: 10px;
  justify-content: space-between;
`;
