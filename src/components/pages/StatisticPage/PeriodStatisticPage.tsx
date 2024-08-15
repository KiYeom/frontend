import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Platform } from 'react-native';
import { css } from '@emotion/native';
import styled from '@emotion/native';
import DatePickerModal from '../../modals/date-picker-modal';
import { useState } from 'react';
import ReportType from './ReportType';
import { useNavigation } from '@react-navigation/native';
import { rsHeight, rsWidth, rsFont } from '../../../utils/responsive-size';
import { useEffect } from 'react';
import PeriodKeywordArea from './Period_keyword/PeriodKeywordArea';
import { periodAnalyze } from '../../../apis/analyze';
import DateLine from '../../atoms/DateLine/DateLine';
import Empty from './Empty';
// 오늘 날짜를 기준으로 일주일 전의 Date 객체 생성
const getOneWeekAgoDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 7); // 현재 날짜에서 7일을 뺍니다.
  return today;
};
const PeriodStatisticPage: React.FC<any> = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [date, setDate] = useState<Date>(new Date()); //현재 날짜
  const [previousDate, setPreviousDate] = useState<Date>(getOneWeekAgoDate());
  const [periodKeyword, setPeriodKeyword] = useState([]);
  const [periodKeywordCnt, setPeriodKeywordCnt] = useState(0);
  const navigation = useNavigation();
  useEffect(() => {
    console.log('기간리포트 열렸습니다');
    const fetchData = async () => {
      /*const res = await periodAnalyze(
        previousDate?.getFullYear() +
          '-' +
          String(previousDate.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(previousDate.getDate()).padStart(2, '0'),
        date?.getFullYear() +
          '-' +
          String(date.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(date.getDate()).padStart(2, '0'),
      ); api 호출 코드*/
      const res = {
        data: {
          start_date: '2024-06-19', //이전 날짜
          end_date: '2024-07-19', //현재 날짜
          count: 0,
          keywords: [],
        },
      };
      console.log('기간 리포트 가짜 api 결과', res.data);
      console.log('개수', res.data.count);
      setPeriodKeyword(res.data.keywords); //키워드 저장
      setPeriodKeywordCnt(res.data.count); //개수 저장
    };
    fetchData();
  }, []);
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
            type="일일리포트"
            navigation={navigation}
            onPress={() => {
              console.log(setOpenModal(true));
            }}></ReportType>
          <DateLine
            value={
              previousDate?.getFullYear() +
              '년 ' +
              String(previousDate.getMonth() + 1).padStart(2, '0') +
              '월 ' +
              String(previousDate.getDate()).padStart(2, '0') +
              '일' +
              ' ~ ' +
              date?.getFullYear() +
              '년 ' +
              String(date.getMonth() + 1).padStart(2, '0') +
              '월 ' +
              String(date.getDate()).padStart(2, '0') +
              '일'
            }
          />
          {periodKeywordCnt ? (
            <PeriodKeywordArea periodKeyword={periodKeyword} setPeriodKeyword={setPeriodKeyword} />
          ) : (
            <Empty type="채팅기록"></Empty>
          )}
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
export default PeriodStatisticPage;
