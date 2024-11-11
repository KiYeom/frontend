import { css } from '@emotion/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon, { TIconName } from '../../icons/icons';

export type EmotionCardProps = {
  status: 'default' | 'simple' | 'default-view';
  emotion: any;
  onPress?: (emotion) => void;
};

const EmotionCard = (props: EmotionCardProps) => {
  const { status, emotion, onPress } = props;

  return (
    <View
      style={css`
        height: ${rsHeight * 100 + 'px'};
        width: ${status === 'simple' ? rsWidth * 60 + 'px' : rsWidth * 100 + 'px'};
        background-color: white;
        border-radius: 10px;
        padding-horizontal: ${rsWidth * 10 + 'px'};
        align-items: center;
        justify-content: center;
        border: 1px solid ${palette.neutral[100]};
      `}>
      <Icon name={`${emotion.group}-emotion` as TIconName} width={rsWidth * 25 + 'px'} />
      {status !== 'simple' && (
        <Text
          style={css`
            font-family: Pretendard-Medium;
            font-size: ${rsFont * 14 + 'px'};
            color: ${palette.neutral[900]};
          `}>
          {emotion.keyword}
        </Text>
      )}
      {status === 'default' && (
        <TouchableOpacity
          onPress={() => onPress(emotion)}
          style={css`
            position: absolute;
            right: 0;
            top: 0;
            width: ${rsWidth * 20 + 'px'};
            height: ${rsHeight * 22 + 'px'};
            align-items: center;
            justify-content: center;
          `}>
          <Icon name={'cancel-icon'} width={rsWidth * 10 + 'px'} height={rsHeight * 10 + 'px'} />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default EmotionCard;
