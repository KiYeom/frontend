import { css } from '@emotion/native';
import React from 'react';
import { Text, View } from 'react-native';
import { rsHeight } from '../../../../utils/responsive-size';
import { Title } from '../StatisticMain.style';
import { Container } from './Keyword.style';

const EmotionDariy: React.FC<any> = (props: any) => {
  const { todayFeeling } = props;
  return (
    <Container>
      <Title>주인님의 한 줄 일기</Title>
      <View
        style={css`
          background-color: white;
          padding: ${rsHeight * 18 + 'px'};
          border-radius: 10px;
        `}>
        <Text style={css``}>
          {todayFeeling === null
            ? '작성하신 일기가 없어요, 멍!🐶작성하신 일기가 없어요, 멍!🐶작성하신 일기가 없어요, 멍!🐶작성하신 일기가 없어요, 멍!🐶작성하신 일기가 없어요, 멍!🐶'
            : todayFeeling}
        </Text>
      </View>
    </Container>
  );
};
export default EmotionDariy;
