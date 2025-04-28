import React from 'react';
import styled, { css } from '@emotion/native';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon, { TIconName } from '../icons/icons';
import { rsWidth, rsHeight, rsFont } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

export const Container = styled.View`
  background-color: pink;
  width: ${rsWidth * 100 + 'px'};
  height: ${rsHeight * 100 + 'px'};
  border-radius: 10px;
  overflow: hidden;
`;

export const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  top: 7px;
  right: 7px;
  background-color: rgba(0, 0, 0, 0.4);
  width: ${rsWidth * 12 + 'px'};
  height: ${rsHeight * 12 + 'px'};
  justify-content: center;
  border-radius: 12px;
  padding: 3px;
  z-index: 1;
`;
