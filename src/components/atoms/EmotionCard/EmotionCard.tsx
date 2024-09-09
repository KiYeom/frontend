import React from 'react';
import { css } from '@emotion/native';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import { View, TouchableOpacity, Text } from 'react-native';
import { TIconName } from '../../icons/icons';
import Icon from '../../icons/icons';
import palette from '../../../assets/styles/theme';
const EmotionCard = ({ emotion, onPress, status }) => {
  return (
    <View
      style={css`
        height: ${rsHeight * 100 + 'px'};
        width: ${status === 'default' ? rsWidth * 100 + 'px' : rsWidth * 60 + 'px'};
        background-color: white;
        border-radius: 10px;
        margin-right: ${rsWidth * 8 + 'px'};
        padding-horizontal: ${rsWidth * 10 + 'px'};
        align-items: center;
        justify-content: center;
        border: 1px solid ${palette.neutral[100]};
      `}>
      {status != 'simple' && (
        <View
          style={css`
            width: 100%;
            flex-direction: row;
            justify-content: flex-end;
          `}>
          <TouchableOpacity
            onPress={() => onPress(emotion)}
            style={css`
              padding: ${rsWidth * 4 + 'px'};
              width: auto;
            `}>
            <Icon name={'cancel-icon'} />
          </TouchableOpacity>
        </View>
      )}

      <Icon name={`${emotion.category}-emotion` as TIconName} width={rsWidth * 25 + 'px'} />
      {status != 'simple' && (
        <Text
          style={css`
            font-family: Pretendard-Medium;
            font-size: ${rsFont * 14 + 'px'};
            color: ${palette.neutral[900]};
          `}>
          {emotion.detail}
        </Text>
      )}
    </View>
  );
};
export default EmotionCard;
