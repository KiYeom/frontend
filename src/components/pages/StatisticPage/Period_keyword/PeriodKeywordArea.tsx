import React from 'react';
import palette from '../../../../assets/styles/theme';
import { rsFont, rsWidth, rsHeight } from '../../../../utils/responsive-size';
import { Container } from '../StatisticMain.style';
import PeriodKeyword from '../../../periodKeyword/PeriodKeyword';
import { Title, DescText } from '../StatisticMain.style';
import { View } from 'react-native';
import { css } from '@emotion/native';
const PeriodKeywordArea: React.FC<any> = (props: any) => {
  const { periodKeyword, setPeriodKeyword } = props;
  return (
    <View
      style={css`
        background-color: yellow;
        gap: ${12 * rsHeight + 'px'};
      `}>
      <Title>나의 기간 토픽</Title>
      <View
        style={css`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          width: 100%;
          height: auto;
          max-height: 197px;
          gap: ${rsHeight * 8 + 'px'};
          background-color: red;
        `}>
        {periodKeyword.map((keyword, index) => (
          <PeriodKeyword key={index} title={keyword} />
        ))}
      </View>
    </View>
  );
};
export default PeriodKeywordArea;
