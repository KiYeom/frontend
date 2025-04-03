import { css } from '@emotion/native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { rsFont, rsWidth } from '../../../utils/responsive-size';
import EmotionCard from '../../../components/atoms/EmotionCard/EmotionCard';
import Icon from '../../../components/icons/icons';
import { SectionTitle } from '../StatisticMain.style';
import { Container, KeywordContainer, KeywordText } from './Keyword.style';
import palette from '../../../assets/styles/theme';

const HINT_NAME = 'record';
const HINT_MESSAGE = '자신이 선택한 그날의 감정이에요!';

const EmotionArea: React.FC<any> = (props: any) => {
  const { isRecordKeywordList, hintStatus, setHintStatus } = props;
  return (
    <Container>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>그 때의 나는 어떤 감정이었나요?</SectionTitle>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}></View>
      </View>
      {isRecordKeywordList.length === 0 ? (
        <KeywordContainer>
          <Icon name={'empty-icon'} />
          <KeywordText>나의 감정은 기록하지 않았어요</KeywordText>
        </KeywordContainer>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={css`
            flex-grow: 1;
          `}
          contentContainerStyle={css`
            flex-grow: 1;
            flex-direction: row;
            gap: ${rsWidth * 8 + 'px'};
          `}>
          {isRecordKeywordList.map((emotion, index) => (
            <EmotionCard key={index} emotion={emotion} onPress={() => {}} status={'default-view'} />
          ))}
        </ScrollView>
      )}
    </Container>
  );
};
export default EmotionArea;
