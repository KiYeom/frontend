import React from 'react';
import { Container, KeywordText, KeywordContainer, KeywordIcon } from './Keyword.style';
import palette from '../../../../assets/styles/theme';
import Icon from '../../../icons/icons';
import { rsWidth, rsHeight } from '../../../../utils/responsive-size';
import { Title } from '../StatisticMain.style';
import Empty from '../Empty';
import { Text, View, ScrollView } from 'react-native';
import { css } from '@emotion/native';
import EmotionCard from '../../../atoms/EmotionCard/EmotionCard';
const EmotionArea: React.FC<any> = (props: any) => {
  const { isRecordKeywordList, isNullRecordKeywordList } = props;
  console.log('-----------isNullRecordKeywordList---', isNullRecordKeywordList);
  console.log('-------isRecordKeywordList-------', isRecordKeywordList);
  return (
    <Container>
      <Title>기록한 감정</Title>
      {isNullRecordKeywordList ? (
        <Empty type="채팅기록"></Empty>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            flexGrow: 0,
          }}
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'row',
          }}>
          {isRecordKeywordList.map((emotion, index) => (
            <EmotionCard key={index} emotion={emotion} onPress={() => {}} status={'default-view'} />
          ))}
        </ScrollView>
      )}
    </Container>
  );
};
export default EmotionArea;
