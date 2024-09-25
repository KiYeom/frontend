import { css } from '@emotion/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon, { TIconName } from '../../icons/icons';

const EmotionCard = ({ emotion, onPress, status }) => {
  return (
    <View
      style={css`
        height: ${rsHeight * 100 + 'px'};
        width: ${status === 'simple' ? rsWidth * 60 + 'px' : rsWidth * 105 + 'px'};
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
          {status === 'default' && (
            <TouchableOpacity
              onPress={() => onPress(emotion)}
              style={css`
                padding: ${rsWidth * 4 + 'px'};
                width: auto;
              `}>
              <Icon name={'cancel-icon'} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <Icon name={`${emotion.group}-emotion` as TIconName} width={rsWidth * 25 + 'px'} />
      {status != 'simple' && (
        <Text
          style={css`
            font-family: Pretendard-Medium;
            font-size: ${rsFont * 14 + 'px'};
            color: ${palette.neutral[900]};
          `}>
          {emotion.keyword}
        </Text>
      )}
    </View>
  );
};
export default EmotionCard;
