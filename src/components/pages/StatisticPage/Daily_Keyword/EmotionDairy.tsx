import { css } from '@emotion/native';
import React from 'react';
import { Text, View } from 'react-native';
import palette from '../../../../assets/styles/theme';
import { rsHeight } from '../../../../utils/responsive-size';
import Icon from '../../../icons/icons';
import { SectionTitle } from '../StatisticMain.style';
import { Container, KeywordContainer, KeywordText } from './Keyword.style';
const EmotionDairy: React.FC<any> = (props: any) => {
  const { todayFeeling } = props;
  return (
    <Container>
      <SectionTitle>그 때의 나는 어떤 생각을 했을까요?</SectionTitle>
      {todayFeeling == '' ? (
        <KeywordContainer>
          <Icon name={'empty-icon'} />
          <KeywordText>나의 생각은 기록하지 않았어요</KeywordText>
        </KeywordContainer>
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
