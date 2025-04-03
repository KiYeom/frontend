import { css } from '@emotion/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight } from '../../../utils/responsive-size';
import Icon from '../../../components/icons/icons';
import { SectionTitle } from '../StatisticMain.style';
import { Container, KeywordContainer, KeywordText } from './Keyword.style';

const HINT_NAME = 'daily';
const HINT_MESSAGE = '자신이 작성한 그날의 기분이에요!';

const EmotionDairy: React.FC<any> = (props: any) => {
  const { todayFeeling, hintStatus, setHintStatus } = props;
  return (
    <Container>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>그 때의 나는 어떤 생각을 했을까요?</SectionTitle>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}></View>
      </View>
      {todayFeeling === '' ? (
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
