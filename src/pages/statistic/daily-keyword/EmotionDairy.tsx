import { css } from '@emotion/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight } from '../../../utils/responsive-size';
type EmotionDairyProps = {
  todayFeeling: string;
};
const EmotionDairy = ({ todayFeeling }: EmotionDairyProps) => {
  return (
    <View
      style={css`
        background-color: white;
        padding: ${rsHeight * 18 + 'px'};
        border-radius: 10px;
      `}>
      <Text
        style={css`
          color: ${palette.neutral[500]};
          font-family: Pretendard-Medium;
          font-size: ${16 * rsFont + 'px'};
        `}>
        {todayFeeling}
      </Text>
    </View>
  );
};
export default EmotionDairy;
