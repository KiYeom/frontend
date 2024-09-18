import React from 'react';
import { Chip } from 'react-native-ui-lib'; // Wix의 UI 라이브러리에서 가져오기
import { View, Text, TouchableOpacity } from 'react-native';
import { css } from '@emotion/native';
import palette from '../../../assets/styles/theme';
import Icon from '../../icons/icons';
import { TIconName } from '../../icons/icons';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
const EmotionChip = ({ group, keyword, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={css`
        display: flex;
        background-color: ${palette.neutral[100]};
        height: ${45 * rsHeight + 'px'};
        flex-direction: row;
        align-items: center; /* 세로 중앙 정렬 */
        justify-content: center; /* 가로 중앙 정렬 */
        padding-horizontal: ${rsWidth * 5 + 'px'};
        padding-vertical: ${rsHeight * 10 + 'px'};
        border-radius: 10px;
        gap: ${rsWidth * 10 + 'px'};
        border: 3px solid ${isSelected ? palette.primary[500] : 'transparent'};
      `}
      onPress={onPress}>
      <Icon name={`${group}-emotion` as TIconName} width={rsWidth * 25 + 'px'} />
      <Text
        style={css`
          flex: 1;
          text-align: center;
          justify-content: center;
          align-self: center;
          //background-color: gray;
          font-family: Pretendard-Regular;
          font-size: ${rsFont * 15 + 'px'};
        `}>
        {keyword}
      </Text>
    </TouchableOpacity>
  );
};

export default EmotionChip;
