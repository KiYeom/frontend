import React from 'react';
import { css } from '@emotion/native';
import { View, Text } from 'react-native';
import { rsHeight, rsWidth, rsFont } from '../../utils/responsive-size';
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
        width: 171px;
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
