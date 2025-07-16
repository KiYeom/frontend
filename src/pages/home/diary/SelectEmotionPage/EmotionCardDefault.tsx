import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { css } from '@emotion/native';
import Icon from '../../../../components/icons/icons';
import { rsFont, rsHeight, rsWidth } from '../../../../utils/responsive-size';
import palette from '../../../../assets/styles/theme';

type Emotion = {
  group: string;
  keyword: string;
};

type EmotionCardDefaultProps = {
  emotion: Emotion;
  onPress?: (emotion: Emotion) => void;
};

const groupToColorMap: Record<string, string> = {
  angry: '#F49B9B',
  sad: '#BCB2FF',
  default: '#D7D7D7',
  happy: '#FFE372',
  calm: '#ABEBC5',
};

const EmotionCardDefault = memo(({ emotion, onPress }: EmotionCardDefaultProps) => {
  const dotColor = groupToColorMap[emotion.group] || groupToColorMap.default;
  return (
    <View
      style={css`
        height: ${rsHeight * 35 + 'px'};
        border-radius: 100px;
        padding-vertical: ${rsHeight * 7 + 'px'};
        padding-horizontal: ${rsWidth * 14 + 'px'};
        background-color: white;
        border: 1px solid ${palette.neutral[300]};
        flex-direction: row;
        align-items: center;
        gap: ${rsWidth * 7 + 'px'};
        width: auto;
      `}>
      <View
        style={{
          backgroundColor: dotColor,
          width: 15,
          height: 15,
          borderRadius: 50,
        }}></View>
      <Text
        style={css`
          margin-left: ${rsWidth * 8}px;
          font-family: Pretendard-Medium;
          font-size: ${rsFont * 14}px;
          color: ${palette.neutral[900]};
        `}>
        {emotion.keyword}
      </Text>
    </View>
  );
});

EmotionCardDefault.displayName = 'EmotionCardDefault';

export default EmotionCardDefault;
