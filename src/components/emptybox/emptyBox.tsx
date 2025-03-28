import React from 'react';
import styled, { css } from '@emotion/native';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon, { TIconName } from '../icons/icons';
import { rsWidth, rsHeight, rsFont } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
type BoxProps = {
  mainTitle?: string;
  subTitle?: string;
  isLeftIcon?: boolean;
  isRightIcon?: boolean;
  iconName?: TIconName;
  iconSize?: number;
  onPress?: () => void;
};
const EmptyBox: React.FC<BoxProps> = (props: BoxProps) => {
  const { mainTitle, subTitle, isLeftIcon, isRightIcon, iconName, iconSize, onPress } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={css`
        background-color: #dcdcdc;
        border-radius: 10px;
        max-width: ${350 * rsWidth + 'px'};
        flex-direction: row;
        padding-horizontal: ${rsWidth * 12 + 'px'};
        padding-vertical: ${rsHeight * 12 + 'px'};
        gap: ${rsWidth * 8 + 'px'};
        justify-content: center;
        align-items: center;
      `}>
      {isLeftIcon && iconName && (
        <View
          style={css`
            background-color: white;
            width: ${rsWidth * 50 + 'px'};
            height: ${rsHeight * 50 + 'px'};
            border-radius: ${rsHeight * 25 + 'px'};
            justify-content: center;
            align-items: center;
          `}>
          <Icon name={iconName} width={iconSize} />
        </View>
      )}
      <View
        style={css`
          //background-color: red;
          flex: 1;
          gap: ${rsHeight * 7 + 'px'};
        `}>
        <Text
          style={css`
            font-family: Pretendard-SemiBold;
            font-size: ${18 * rsFont + 'px'};
            //letter-spacing: -2.5%;
            //line-height: auto;
            color: ${palette.neutral[900]};
          `}>
          {mainTitle}
        </Text>
        <Text
          style={css`
            font-family: Pretendard-Regular;
            font-size: ${14 * rsFont + 'px'};
            //letter-spacing: -2.5%;
            //line-height: auto;
          `}>
          {subTitle}
        </Text>
      </View>
      {isRightIcon && iconName && (
        <View
          style={css`
            background-color: white;
            width: ${rsWidth * 50 + 'px'};
            height: ${rsHeight * 50 + 'px'};
            border-radius: ${rsHeight * 25 + 'px'};
            justify-content: center;
            align-items: center;
          `}>
          <Icon name={iconName} width={iconSize} />
        </View>
      )}
    </TouchableOpacity>
  );
};
export default EmptyBox;
