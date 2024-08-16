import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StatusBar } from 'react-native';
import { Platform } from 'react-native';
import { css } from '@emotion/native';
import { useState } from 'react';
import { View } from 'react-native';
import ReportType from './ReportType';
import { useNavigation } from '@react-navigation/native';
import { rsHeight, rsWidth, rsFont } from '../../../utils/responsive-size';
import { useEffect } from 'react';
import PeriodKeywordArea from './Period_keyword/PeriodKeywordArea';
import DateLine from '../../atoms/DateLine/DateLine';
import PeriodFlowChart from './Period_FlowChart/PeriodFlowChartArea';
import dayjs from 'dayjs';
import DateType from 'react-native-ui-datepicker';
import { useCallback } from 'react';
import { periodChart, periodKeyword } from '../../../apis/analyze';
import RangeDatePickerModal from '../../rangeCal/range-date-picker-modal';
import { StyleSheet, ActivityIndicator } from 'react-native';
import palette from '../../../assets/styles/theme';

const PeriodStatisticPage: React.FC<any> = () => {
  const [loading, setLoading] = useState(true);
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
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  const onChange = useCallback((newRange) => {
    setRange(newRange); // RangeDatePickerModal에서 전달된 range로 업데이트
  }, []);

  if (loading) {
    return (
      <View
        style={css`
          flex: 1;
          justify-content: center;
          align-items: center;
        `}>
        <ActivityIndicator size="large" color={palette.primary[500]} />
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'blue',
        flex: 1,
      }}
      edges={['top']}>
      <ScrollView
        style={css`
          flex: 1; //통계 전체 컨테이너 (대시보드)
          flex-direction: column;
          background-color: ${palette.neutral[50]};
          padding-vertical: ${rsHeight * 40 + 'px'};
        `}>
        <ReportType
          type="일일리포트"
          navigation={navigation}
          onPress={() => {
            setOpenModal(true);
          }}></ReportType>
        <DateLine
          value={
            range.startDate && range.endDate
              ? `${dayjs(range.startDate).locale(locale).format('YYYY년 M월 D일')} ~ ${dayjs(range.endDate).locale(locale).format('YYYY년 M월 D일')}`
              : '날짜를 선택해주세요'
          }
        />
        <PeriodFlowChart
          emotionsData={emotionsData}
          setEmotionsData={setEmotionsData}
          startDate={dayjs(range.startDate).format('YYYY-MM-DD')}
          endDate={dayjs(range.endDate).format('YYYY-MM-DD')}
        />
        <PeriodKeywordArea
          periodKeywordList={periodKeywordList}
          setPeriodKeywordList={setPeriodKeywordList}
        />
        <RangeDatePickerModal
          modalVisible={openModal}
          onClose={() => setOpenModal(false)}
          onChange={onChange}
          range={range}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default PeriodStatisticPage;
