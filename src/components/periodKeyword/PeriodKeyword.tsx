import { css } from '@emotion/native';
import React from 'react';
import { Text, View } from 'react-native';
import { rsHeight } from '../../utils/responsive-size';

export type PeriodKeywordProps = {
  title: string;
};

//키워드 컴포넌트
const PeriodKeyword = (props: PeriodKeywordProps) => {
  const { title } = props;
  return (
    <View
      style={css`
        padding-vertical: ${rsHeight * 8 + 'px'};
        background-color: white;
        border-radius: 10px;
        width: 48%;
        height: auto;
        max-height: 33px;
        justify-content: center;
        align-items: center;
      `}>
      <Text>{title}</Text>
    </View>
  );
};
export default PeriodKeyword;
