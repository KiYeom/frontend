import { css } from '@emotion/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon, { TIconName } from '../../icons/icons';

const EmotionChip = ({ group, keyword, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={css`
        background-color: ${palette.neutral[100]};
        height: ${rsHeight * 45 + 'px'};
        flex-direction: row;
        align-items: center; /* 세로 중앙 정렬 */
        justify-content: center; /* 가로 중앙 정렬 */
        padding-horizontal: ${rsWidth * 5 + 'px'};
        padding-vertical: ${rsHeight * 10 + 'px'};
        margin-vertical: ${rsHeight * 5 + 'px'};
        border-radius: 10px;
        gap: ${rsWidth * 10 + 'px'};
        border: 3px solid ${isSelected ? palette.primary[500] : 'transparent'};
      `}
      onPress={onPress}>
      <Icon name={`${group}-emotion` as TIconName} width={rsWidth * 35 + 'px'} />
      <Text
        style={css`
          flex: 1;
          text-align: center;
          justify-content: center;
          align-self: center;
          font-family: Pretendard-Regular;
          font-size: ${rsFont * 15 + 'px'};
        `}>
        {keyword}
      </Text>
    </TouchableOpacity>
  );
};

export default EmotionChip;
