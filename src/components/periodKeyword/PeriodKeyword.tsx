import { css } from '@emotion/native';
import React from 'react';
import { Text, View } from 'react-native';
import { rsFont, rsHeight } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

export type PeriodKeywordProps = {
  title: string;
  ranking: number;
};

//키워드 컴포넌트
const PeriodKeyword = (props: PeriodKeywordProps) => {
  const { title, ranking } = props;
  return (
    <View
      style={css`
        padding-vertical: ${rsHeight * 8 + 'px'};
        background-color: #ffffff;
        border-width: 1px;
        border-color: ${palette.neutral[100]};
        border-radius: 12px;
        width: ${ranking === 1 ? '100%' : '48%'};
        flex-direction: row;
        justify-content: center;
        align-items: center;
      `}>
      <Text
        style={css`
          font-size: ${rsFont * (ranking === 1 ? 22 : 16) + 'px'};
          font-family: Kyobo-handwriting;
        `}>
        {ranking}.{' '}
      </Text>
      <Text
        style={css`
          font-size: ${rsFont * (ranking === 1 ? 22 : 16) + 'px'};
          font-family: Kyobo-handwriting;
        `}>
        {title}
      </Text>
    </View>
  );
};
export default PeriodKeyword;
