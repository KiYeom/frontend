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
  //background-color: red;
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
  //background-color: pink;
  background-color: white;
  border-radius: 10px;
  padding-horizontal: 20px;
  padding-vertical: 20px;
  justify-content: space-between;
  position: relative;
  gap: ${rsWidth * 20 + 'px'};
  margin-bottom: 10px;
`;

export const SectionComponentText = styled.Text`
  font-size: ${rsFont * 16 + 'px'};
  font-family: Pretendard-Regular;
  color: ${palette.neutral[900]};
  line-height: ${rsFont * 24 + 'px'};
  margin-left: 8px;
  flex: 1;
  padding-right: 20px;
  //background-color: yellow;
  text-align: left;
  text-align-vertical: center;
`;
export const SectionComponentImage = styled.Image`
  width: 28px;
  height: 28px;
`;

export const SectionDateContainer = styled.View`
  padding: 10px;
  //background-color: blue;
`;

export const SectionDateText = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Kyobo-handwriting;
  color: ${palette.neutral[900]};
`;
