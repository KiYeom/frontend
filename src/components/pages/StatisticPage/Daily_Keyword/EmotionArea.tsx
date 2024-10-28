import { css } from '@emotion/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { rsWidth } from '../../../../utils/responsive-size';
import EmotionCard from '../../../atoms/EmotionCard/EmotionCard';
import Empty from '../Empty';
import { Title } from '../StatisticMain.style';
import { Container } from './Keyword.style';

const EmotionArea: React.FC<any> = (props: any) => {
  const { isRecordKeywordList, isNullRecordKeywordList } = props;
  return (
    <Container>
      <Title>주인님의 감정 일기</Title>
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
