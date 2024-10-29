import { css } from '@emotion/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { rsWidth } from '../../../../utils/responsive-size';
import EmotionCard from '../../../atoms/EmotionCard/EmotionCard';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import { Container } from './Keyword.style';

const EmotionArea: React.FC<any> = (props: any) => {
  const { isRecordKeywordList, isNullRecordKeywordList } = props;
  return (
    <Container>
      <SectionTitle>그 때의 나는 어떤 감정이었나요?</SectionTitle>
      {isNullRecordKeywordList ? (
        <Empty type="감정기록"></Empty>
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
