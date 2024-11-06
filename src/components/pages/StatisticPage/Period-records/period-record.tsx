import React from 'react';
import { EmotionKeyword, TRecordEmotion } from '../../../../apis/analyze.type';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import { RContainer, RecordContainer, RecordText, RecordTitle } from './period-record.style';

export type PeriodRecordProps = {
  records: TRecordEmotion[];
};

//키워드 컴포넌트
const PeriodRecord = (props: PeriodRecordProps) => {
  const { records } = props;
  const getEmotionsText = (recordKeywords: EmotionKeyword[]): string => {
    return recordKeywords.map((keyword) => keyword.keyword).join(', ');
  };

  return (
    <RContainer>
      {/*<RTitle>내가 기록한 감정들</RTitle>*/}
      <SectionTitle>내가 기록한 하루들</SectionTitle>
      {records.length === 0 ? (
        <Empty type="채팅기록"></Empty>
      ) : (
        records.map((record, index) => (
          <RecordContainer key={index}>
            <RecordText>{record.date}</RecordText>
            <RecordTitle>{'기록한 감정들: ' + getEmotionsText(record.keywords)}</RecordTitle>
            <RecordTitle>{'한 줄 일기: ' + (record.todayFeeling ?? '기록 없음.')}</RecordTitle>
          </RecordContainer>
        ))
      )}
    </RContainer>
  );
};
export default PeriodRecord;
