import React from 'react';
import { rsHeight } from '../../../utils/responsive-size';
import { Platform, SafeAreaView, StatusBar, View } from 'react-native';
import DatePickerModal from '../../modals/date-picker-modal';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { css } from '@emotion/native';
import DailyEmotionClassification from './Daily_EmotionClassification/DailyEmotionClassification';
import DateLine from '../../atoms/DateLine/DateLine';
import KeywordArea from './Daily_Keyword/KeywordArea';
import { Container } from './StatisticMain.style';
import ReportType from './ReportType';
import { dailyAnalyze } from '../../../apis/analyze';
import { useNavigation } from '@react-navigation/native';
import { TLabel } from '../../../apis/analyze.type';
import palette from '../../../assets/styles/theme';

const START_HOUR_OF_DAY = 6;

const getServerYestoday = (currentDate: Date = new Date()) => {
  let utc = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  let koreaTime = new Date(utc + 9 * 60 * 60 * 1000); // UTC+9 시간대

  let hour = koreaTime.getHours();

  if (hour >= 0 && hour < START_HOUR_OF_DAY) {
    // 오전 0시에서 6시 사이라면 어꺼제 출력
    koreaTime.setDate(koreaTime.getDate() - 2);
  } else {
    // 그렇지 않으면 어제 출력
    koreaTime.setDate(koreaTime.getDate() - 1);
  }
  return koreaTime;
};

const getDateString = (date: Date): string => {
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
  const [date, setDate] = useState<Date | undefined>(getServerYestoday()); //현재 날짜
  const [openModal, setOpenModal] = React.useState(false);
  const [isNullClassification, setIsNullClassification] = useState(true);
  const [labelsClassification, setLabelsClassification] = useState<TLabel[]>([]);
  const [isSummaryList, setIsSummaryList] = useState(true);
  const [summaryList, setSummaryList] = useState<string[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const dailyStatistics = await dailyAnalyze(getApiDateString(date ?? getServerYestoday()));
      if (!dailyStatistics) {
        alert('네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      setIsNullClassification(dailyStatistics.classification.isNULL);
      setLabelsClassification(dailyStatistics.classification.labels);
      setIsSummaryList(dailyStatistics.summary.isNULL);
      setSummaryList(dailyStatistics.summary.keywords);
    };
    fetchData();
  }, [date]);

  return (
    <View style={{ flex: 1, backgroundColor: palette.neutral[50] }}>
      <SafeAreaView
        style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <ScrollView>
          <View
            style={css`
              flex: 1; //통계 전체 컨테이너 (대시보드)
              flex-direction: column;
              background-color: ${palette.neutral[50]};
              padding-vertical: ${rsHeight * 20 + 'px'};
              gap: ${rsHeight * 16 + 'px'};
              padding-top: ${rsHeight * 40 + 'px'};
            `}>
            <ReportType
              type="기간리포트"
              navigation={navigation}
              onPress={() => {
                setOpenModal(true);
              }}></ReportType>
            <DateLine value={getDateString(date ?? getServerYestoday())} />
            <Container>
              <DailyEmotionClassification
                isNullClassification={isNullClassification}
                labelsClassification={labelsClassification}
              />
              <KeywordArea isSummaryList={isSummaryList} summaryList={summaryList} />
            </Container>
          </View>
        </ScrollView>
      </SafeAreaView>

      <DatePickerModal
        modalVisible={openModal}
        onClose={() => setOpenModal(false)}
        onChange={setDate}
      />
    </View>
  );
};

export default StatisticMain;
