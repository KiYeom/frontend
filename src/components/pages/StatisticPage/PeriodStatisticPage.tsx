import { css } from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { periodChart, periodKeyword, periodRecordEmotions } from '../../../apis/analyze';
import { TPeriodRecordEmotions } from '../../../apis/analyze.type';
import palette from '../../../assets/styles/theme';
import Analytics from '../../../utils/analytics';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import RangeDatePickerModal from '../../rangeCal/range-date-picker-modal';
import PeriodRecord from './Period-records/period-record';
import PeriodFlowChart from './Period_FlowChart/PeriodFlowChartArea';
import PeriodKeywordArea from './Period_keyword/PeriodKeywordArea';
import ReportType from './ReportType';
import { DateLineText, StatisticTitle } from './StatisticMain.style';
const PeriodStatisticPage: React.FC<any> = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [periodKeywordList, setPeriodKeywordList] = useState([]);
  const [locale, setLocale] = useState('ko');
  const [recordEmotions, setRecordEmotions] = useState<TPeriodRecordEmotions | undefined>(
    undefined,
  );

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

  const insets = useSafeAreaInsets();

  //날짜가 변경되는 경우
  useEffect(() => {
    Analytics.watchPeriodStatisticScreen();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const startDateFormatted = dayjs(range.startDate).format('YYYY-MM-DD');
        const endDateFormatted = dayjs(range.endDate).format('YYYY-MM-DD');

        const [res, res2, res3] = await Promise.all([
          periodChart(startDateFormatted, endDateFormatted), //기간 감정 차트
          periodKeyword(startDateFormatted, endDateFormatted), //기간 키워드 리스트
          periodRecordEmotions(startDateFormatted, endDateFormatted), //기간 기록한 감정들
        ]);
        if (res && res.charts) {
          setEmotionsData(res.charts);
        }
        if (res2 && res2.keywords) {
          setPeriodKeywordList(res2.keywords);
        }
        if (res3) {
          setRecordEmotions(res3);
        }
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
    <View
      style={css`
        /* background-color: ${palette.neutral[50]}; */
        flex: 1;
        padding-top: ${insets.top + 'px'};
      `}>
      <ScrollView>
        <View
          style={css`
            gap: ${rsHeight * 16 + 'px'};
            margin-vertical: ${rsHeight * 12 + 'px'};
          `}>
          <ReportType
            type="일일리포트"
            navigation={navigation}
            onPress={() => {
              Analytics.clickPeriodCalendarButton();
              setOpenModal(true);
            }}></ReportType>
          <View
            style={{
              //backgroundColor: 'yellow',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: 70 * rsWidth,
                height: 70 * rsHeight,
                aspectRatio: 1, // 가로 세로 비율을 고정
                resizeMode: 'contain', // 이미지를 잘리지 않게 표시
              }}
              source={{
                uri: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/statistic/reportlogo.png',
              }}
            />
            <View style={{ marginVertical: 10 * rsHeight }}>
              {/*<DateLineText>{getDateString(date ?? getServerYesterday())}</DateLineText>*/}
              <DateLineText>
                {range.startDate && range.endDate
                  ? `${dayjs(range.startDate).locale(locale).format('YYYY년 M월 D일')}부터 ${dayjs(range.endDate).locale(locale).format('YYYY년 M월 D일')}까지`
                  : '날짜를 선택해주세요'}
              </DateLineText>
              <StatisticTitle>쿠키와의 대화에서{'\n'}마음을 살펴보았어요</StatisticTitle>
            </View>
          </View>
          {/*<PageName type={`쿠키가 생각했던${'\n'}주인님의 모습이에요`} />*/}
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
          <PeriodRecord records={recordEmotions ? recordEmotions.records : []} />
        </View>
      </ScrollView>
      <RangeDatePickerModal
        modalVisible={openModal}
        onClose={() => setOpenModal(false)}
        onChange={onChange}
        range={range}
      />
    </View>
  );
};
export default PeriodStatisticPage;
