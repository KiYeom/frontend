import React from 'react';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import { Platform, SafeAreaView, StatusBar } from 'react-native';
import { getTime, formatDate } from '../../../utils/Chatting';
import DatePickerModal from '../../modals/date-picker-modal';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { css } from '@emotion/native';
import DailyEmotionClassification from './Daily_EmotionClassification/DailyEmotionClassification';
import DateLine from '../../atoms/DateLine/DateLine';
import KeywordArea from './Daily_Keyword/KeywordArea';
import palette from '../../../assets/styles/theme';
import { Text, View } from 'react-native';
import { Container } from './StatisticMain.style';
import ReportType from './ReportType';
import { dailyAnalyze } from '../../../apis/analyze';
//전체 통계 화면
const StatisticMain: React.FC<any> = () => {
  const [date, setDate] = useState<Date>(new Date()); //현재 날짜
  const [openModal, setOpenModal] = React.useState(false);
  const [isNullClassification, setIsNullClassification] = useState(true);
  const [labelsClassification, setLabelsClassification] = useState([]);
  const [isSummaryList, setIsSummaryList] = useState(true);
  const [summaryList, setSummaryList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await dailyAnalyze(
        date?.getFullYear() +
          '-' +
          String(date.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(date.getDate()).padStart(2, '0'),
      );
      console.log('res', res);
      setIsNullClassification(res.classification.isNULL);
      setLabelsClassification(res.classification.labels);
      setIsSummaryList(res.summary.isNULL);
      setSummaryList(res.summary.keywords);
    };
    fetchData();
  }, [date]);

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <ScrollView
          style={css`
            flex: 1; //통계 전체 컨테이너 (대시보드)
            flex-direction: column;
            background-color: orange;
            padding-vertical: ${rsHeight * 16 + 'px'};
            padding-horizontal: ${rsWidth * 20 + 'px'};
          `}>
          <ReportType
            value={
              date?.getFullYear() +
              '년 ' +
              String(date.getMonth() + 1).padStart(2, '0') +
              '월 ' +
              String(date.getDate()).padStart(2, '0') +
              '일'
            }
            onPress={() => {
              console.log(setOpenModal(true));
            }}></ReportType>
          <DateLine
            value={
              date?.getFullYear() +
              '년 ' +
              String(date.getMonth() + 1).padStart(2, '0') +
              '월 ' +
              String(date.getDate()).padStart(2, '0') +
              '일'
            }
            onPress={() => {
              console.log(setOpenModal(true));
            }}
          />
          <Container>
            <DailyEmotionClassification
              isNullClassification={isNullClassification}
              labelsClassification={labelsClassification}
            />
            <KeywordArea isSummaryList={isSummaryList} summaryList={summaryList} />
          </Container>
        </ScrollView>
      </SafeAreaView>
      <DatePickerModal
        modalVisible={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        onChange={setDate}
      />
    </>
  );
};

export default StatisticMain;
