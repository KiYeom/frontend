import React from 'react';
import { EmotionKeyword, TRecordEmotion } from '../../../../apis/analyze.type';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import {
  RContainer,
  RecordContainer,
  RecordDailyText,
  RecordDateArea,
  RecordDateIcon,
  RecordDateText,
  RecordKeywordText,
} from './period-record.style';
import { TouchableOpacity, View } from 'react-native';
import Icon from '../../../icons/icons';
import palette from '../../../../assets/styles/theme';

export type PeriodRecordProps = {
  records: TRecordEmotion[];
};

//키워드 컴포넌트
const PeriodRecord = (props: PeriodRecordProps) => {
  const { records } = props;
  const getLocalDate = (date: string, locale: string) => {
    const formattedDate = new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    if (locale === 'ko-KR') {
      // Remove any unwanted characters and reformat correctly
      const [year, month, day] = formattedDate.replace(/\./g, '').split(' ');
      return `${year}년 ${month}월 ${day}일`;
    }

    return formattedDate;
  };
  const getEmotionsText = (recordKeywords: EmotionKeyword[]): string => {
    return recordKeywords.map((keyword) => `#${keyword.keyword} `).join(' ');
  };
  const getEmotionIcon = (emotion: string) => {};

  return (
    <RContainer>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>내가 기록한 하루들</SectionTitle>
        <TouchableOpacity
          activeOpacity={1}
          style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
          onPress={() => {
            /* Handle press here */
          }}>
          <Icon name="information" width={16} height={16} />
        </TouchableOpacity>
      </View>
      {records.length === 0 ? (
        <Empty type="채팅기록"></Empty>
      ) : (
        records.map((record, index) => (
          <RecordContainer key={index}>
            <RecordDateArea>
              <RecordDateIcon>
                <Icon name={'default-heart'} width={25} height={25} color={palette.neutral[300]} />
              </RecordDateIcon>
              <RecordDateText>{getLocalDate(record.date, 'ko-KR')}</RecordDateText>
            </RecordDateArea>
            {record.keywords && record.keywords.length > 0 && (
              <RecordKeywordText>{getEmotionsText(record.keywords)}</RecordKeywordText>
            )}
            {record.todayFeeling && <RecordDailyText>{record.todayFeeling}</RecordDailyText>}
          </RecordContainer>
        ))
      )}
    </RContainer>
  );
};
export default PeriodRecord;
