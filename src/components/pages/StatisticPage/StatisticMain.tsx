import * as amplitude from '@amplitude/analytics-react-native';
import { css } from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze } from '../../../apis/analyze';
import { TEmotionCheck, TLabel } from '../../../apis/analyze.type';
import palette from '../../../assets/styles/theme';
import { rsHeight } from '../../../utils/responsive-size';
import DateLine from '../../atoms/DateLine/DateLine';
import SingleDatePickerModal from '../../rangeCal/single-date-picker-modal';
import DailyEmotionClassification from './Daily_EmotionClassification/DailyEmotionClassification';
import EmotionArea from './Daily_Keyword/EmotionArea';
import EmotionDariy from './Daily_Keyword/EmotionDairy';
import KeywordArea from './Daily_Keyword/KeywordArea';
import PageName from './PageName';
import ReportType from './ReportType';
import { Container } from './StatisticMain.style';

const START_HOUR_OF_DAY = 6;

const getServerYestoday = (currentDate: Date = new Date()) => {
  let utc = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  let koreaTime = new Date(utc + 9 * 60 * 60 * 1000); // UTC+9 시간대

  let hour = koreaTime.getHours();

  if (hour >= 0 && hour < START_HOUR_OF_DAY) {
    // 오전 0시에서 6시 사이라면 엊그제 출력 (2일전)
    koreaTime.setDate(koreaTime.getDate() - 2);
  } else {
    // 그렇지 않으면 어제 출력 (어제)
    koreaTime.setDate(koreaTime.getDate() - 1);
  }
  return koreaTime;
};

const getDateString = (date: Date): string => {
  //console.log('getDateString', date, Object.prototype.toString.call(date));
  //console.log('getDateString getfullyear', date.getFullYear);
  return (
    date?.getFullYear() +
    '년 ' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '월 ' +
    String(date.getDate()).padStart(2, '0') +
    '일'
  );
};

const getApiDateString = (date: Date): string => {
  return (
    date?.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
};

//전체 통계 화면
const StatisticMain: React.FC<any> = () => {
  const [date, setDate] = useState<Date | undefined>(getServerYestoday()); //서버에서 계산하는 날짜
  const [openModal, setOpenModal] = React.useState(false);
  const [isNullClassification, setIsNullClassification] = useState(true);
  const [labelsClassification, setLabelsClassification] = useState<TLabel[]>([]);
  const [isSummaryList, setIsSummaryList] = useState(true);
  const [isRecordKeywordList, setIsRecordKeywordList] = useState<TEmotionCheck[]>([]);
  const [isNullRecordKeywordList, setIsNullRecordKeywordList] = useState(false);
  const [summaryList, setSummaryList] = useState<string[]>([]);
  const [todayFeeling, setTodayFeeling] = useState<string>('');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const onChange = useCallback((newDate) => {
    //console.log('onchange', newDate);
    setDate(newDate);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const dailyStatistics = await dailyAnalyze(getApiDateString(date ?? getServerYestoday()));
      console.log('dailyStatistics', dailyStatistics);
      if (!dailyStatistics) {
        alert('네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      setIsNullClassification(dailyStatistics.classification.isNULL);
      setLabelsClassification(dailyStatistics.classification.labels);
      setIsSummaryList(dailyStatistics.summary.isNULL);
      setSummaryList(dailyStatistics.summary.keywords);
      setIsRecordKeywordList(dailyStatistics.record.Keywords);
      setIsNullRecordKeywordList(dailyStatistics.record.isNULL);
      setTodayFeeling(dailyStatistics.record.todayFeeling);
    };
    fetchData();
  }, [date]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: palette.neutral[50],
        paddingTop: insets.top,
      }}>
      <ScrollView style={{ paddingTop: rsHeight * 12 }}>
        <View
          style={css`
            flex: 1; //통계 전체 컨테이너 (대시보드)
            flex-direction: column;
            background-color: ${palette.neutral[50]};
            padding-bottom: ${rsHeight * 20 + 'px'};
            gap: ${rsHeight * 16 + 'px'};
          `}>
          <ReportType
            type="기간리포트"
            navigation={navigation}
            onPress={() => {
              setOpenModal(true);
              amplitude.track('기간 리포트 버튼 클릭');
            }}></ReportType>
          <PageName type={`쿠키가 생각했던${'\n'}주인님의 모습이에요`} />
          <DateLine value={getDateString(date ?? getServerYestoday())} />
          <Container>
            <DailyEmotionClassification
              isNullClassification={isNullClassification}
              labelsClassification={labelsClassification}
            />
            <EmotionArea
              isRecordKeywordList={isRecordKeywordList}
              isNullRecordKeywordList={isNullRecordKeywordList}
            />
            <EmotionDariy todayFeeling={todayFeeling} />
            <KeywordArea isSummaryList={isSummaryList} summaryList={summaryList} />
          </Container>
        </View>
      </ScrollView>
      <SingleDatePickerModal
        modalVisible={openModal}
        onClose={() => setOpenModal(false)}
        onChange={onChange}
      />
    </View>
  );
};

export default StatisticMain;
