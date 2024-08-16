import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableWithoutFeedback } from 'react-native';
import { View } from 'react-native';
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
import DateLine from '../../atoms/DateLine/DateLine';
import Empty from './Empty';
import PeriodFlowChart from './Period_FlowChart/PeriodFlowChartArea';
import dayjs from 'dayjs';
import DateTimePicker, { DateType, ModeType } from 'react-native-ui-datepicker';
import { useCallback } from 'react';
import { periodChart, periodKeyword } from '../../../apis/analyze';
import RangeDatePickerModal from '../../rangeCal/range-date-picker-modal';
const PeriodStatisticPage: React.FC<any> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [periodKeywordList, setPeriodKeywordList] = useState([]);
  const [locale, setLocale] = useState('ko');

  const [range, setRange] = React.useState<{
    startDate: DateType;
    endDate: DateType;
  }>({
    startDate: dayjs().subtract(7, 'day').startOf('day'), // 일주일 전 날짜
    endDate: dayjs().startOf('day'), // 현재 날짜
  });
  const [emotionsData, setEmotionsData] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);

  const navigation = useNavigation();
  //날짜가 변경되는 경우
  useEffect(() => {
    const fetchData = async () => {
      console.log('날짜가 변경됨');
      try {
        setIsLoading(true);
        setError(null);

        const startDateFormatted = dayjs(range.startDate).format('YYYY-MM-DD');
        const endDateFormatted = dayjs(range.endDate).format('YYYY-MM-DD');

        const [res, res2] = await Promise.all([
          periodChart(startDateFormatted, endDateFormatted), //기간 감정 차트
          periodKeyword(startDateFormatted, endDateFormatted), //기간 키워드 리스트
        ]);

        if (res && res.charts) {
          setEmotionsData(res.charts);
        }
        if (res2 && res2.keywords) {
          setPeriodKeywordList(res2.keywords);
        }
        console.log('시작 날짜 ', startDateFormatted);
        console.log('종료 날짜 ', endDateFormatted);
        console.log('기간 리포트 api 응답 결과', res.charts);
        console.log('기간 키워드 결과', res2.keywords);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range]);

  const onChange = useCallback((params) => {
    setRange(params);
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
          `}>
          <ReportType
            type="일일리포트"
            navigation={navigation}
            onPress={() => {
              //console.log(setOpenModal(true));
              setOpenModal(true);
              //setVisible(true);
            }}></ReportType>
          <DateLine
            value={
              range.startDate && range.endDate
                ? `${dayjs(range.startDate).locale(locale).format('YYYY년 M월 D일')} ~ ${dayjs(range.endDate).locale(locale).format('YYYY년 M월 D일')}`
                : '날짜를 선택해주세요'
            }
          />
          <PeriodFlowChart emotionsData={emotionsData} setEmotionsData={setEmotionsData} />
          <PeriodKeywordArea
            periodKeywordList={periodKeywordList}
            setPeriodKeywordList={setPeriodKeywordList}
          />
        </ScrollView>
      </SafeAreaView>
      <RangeDatePickerModal
        modalVisible={openModal}
        onClose={() => setOpenModal(false)}
        onChange={onChange}
      />
    </>
  );
};
export default PeriodStatisticPage;
