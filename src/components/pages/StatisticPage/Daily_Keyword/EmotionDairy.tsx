import { css } from '@emotion/native';
import React from 'react';
import { Text, View } from 'react-native';
import palette from '../../../../assets/styles/theme';
import { rsHeight } from '../../../../utils/responsive-size';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import { Container } from './Keyword.style';

const EmotionDairy: React.FC<any> = (props: any) => {
  const { todayFeeling } = props;
  return (
    <Container>
      <SectionTitle>그 때의 나는 어떤 생각을 했을까요?</SectionTitle>
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
