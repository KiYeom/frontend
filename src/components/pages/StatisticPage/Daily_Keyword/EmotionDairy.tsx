import { css } from '@emotion/native';
import React from 'react';
import { Text, View } from 'react-native';
import palette from '../../../../assets/styles/theme';
import { rsHeight } from '../../../../utils/responsive-size';
import Empty from '../Empty';
import { Title } from '../StatisticMain.style';
import { Container } from './Keyword.style';

const EmotionDairy: React.FC<any> = (props: any) => {
  const { todayFeeling } = props;
  return (
    <Container>
      <Title>주인님의 한 줄 일기</Title>
      {!todayFeeling ? (
        <Empty type="한줄일기"></Empty>
      ) : (
        <View
          style={css`
            background-color: white;
            padding: ${rsHeight * 18 + 'px'};
            border-radius: 10px;
          `}>
          <Text
            style={css`
              color: ${palette.neutral[500]};
            `}>
            {todayFeeling === null ? '' : todayFeeling}
          </Text>
        </View>
      )}
    </Container>
  );
};
export default EmotionDairy;
