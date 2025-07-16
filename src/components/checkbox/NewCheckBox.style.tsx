/** @jsxImportSource @emotion/react */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from '@emotion/native';
import palette from '../../assets/styles/theme';

export const boxSize = 25;

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  //background-color: yellow;
  width: 100%;
  justify-content: flex-start;
`;

export const MessageText = styled.Text`
  font-size: 14px;
  margin-left: 8px;
  font-family: 'Pretendard-Regular';
  color: ${palette.neutral[900]};
`;

// Custom checkbox that mimics Paper's Checkbox.Android
export const CustomCheckbox = styled.TouchableOpacity`
  width: ${boxSize + 'px'};
  height: ${boxSize + 'px'};
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  border-radius: 10px;
  //background-color: red;
`;
