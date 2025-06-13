import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { css } from '@emotion/native';
import dayjs from 'dayjs';
import {
  periodChart,
  periodKeyword,
  periodRecordEmotions,
  periodTotalEmotion,
} from '../../apis/analyze';
import { TPeriodRecordEmotions } from '../../apis/analyze.type';
import palette from '../../assets/styles/theme';
import Analytics from '../../utils/analytics';
import { rsHeight } from '../../utils/responsive-size';
import { RootStackName, HomeStackName } from '../../constants/Constants';
import { getDate } from '../../utils/times';
import { Container } from './StatisticMain.style';
import StatisticLayout from '../../components/layout/StatisticLayout';
import RangeDatePickerModal from '../../components/rangeCal/range-date-picker-modal';
import PeriodRecord from './Period-records/period-record';
import EmptyBox from '../../components/emptybox/emptyBox';
import CTAButton from '../../components/CTAButton/CTAButton';
import NewPeriodFlowChartArea from './Period_FlowChart/NewPeriodFlowChartArea';
import { newPeriodChart } from '../../apis/analyze';
import NewPeriodEmotionArea from './Period_Emotion/NewPeriodEmotionArea';
import NewPeriodKeywordArea from './Period_keyword/NewPeriodKeywordArea';
import DailyDairy from '../HomePage/diary/DailyDairy';

const PeriodStatisticPage: React.FC<any> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [periodKeywordList, setPeriodKeywordList] = useState([]);
  const [locale, setLocale] = useState('ko');
  const [recordEmotions, setRecordEmotions] = useState<TPeriodRecordEmotions | undefined>(
    undefined,
  );
  const [totalEmotions, setTotalEmotions] = useState<string[]>([]);
  const [hintStatus, setHintStatus] = useState<
    'period-flow' | 'period-keyword' | 'period-record' | 'period-emotion' | 'main' | undefined
  >(undefined);

  const [range, setRange] = React.useState<{
    startDate: DateType;
    endDate: DateType;
  }>({
    startDate: dayjs().subtract(7, 'day').startOf('day'),
    endDate: dayjs().startOf('day'),
  });
  const [emotionsData, setEmotionsData] = useState<string[]>([]);
  const [openModal, setOpenModal] = React.useState(false);

  useEffect(() => {
    Analytics.watchPeriodStatisticScreen();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const startDateFormatted = dayjs(range.startDate).format('YYYY-MM-DD');
        const endDateFormatted = dayjs(range.endDate).format('YYYY-MM-DD');

        const [res, res2, res3, res4] = await Promise.all([
          newPeriodChart(startDateFormatted, endDateFormatted),
          periodKeyword(startDateFormatted, endDateFormatted),
          periodRecordEmotions(startDateFormatted, endDateFormatted),
          periodTotalEmotion(startDateFormatted, endDateFormatted),
        ]);
        if (res) {
          setEmotionsData(res);
        }
        if (res2 && res2.keywords) {
          setPeriodKeywordList(res2.keywords);
        }
        if (res3) {
          setRecordEmotions(res3);
        }
        if (res4) {
          setTotalEmotions(res4.emotions);
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
    setRange(newRange);
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
    <StatisticLayout
      headerTitle="나의 감정 타임라인"
      iconName="calendar"
      dateText={
        range.startDate && range.endDate
          ? `${dayjs(range.startDate).locale(locale).format('YYYY년 M월 D일')} ~ ${dayjs(range.endDate).locale(locale).format('YYYY년 M월 D일')}`
          : '날짜를 선택해주세요'
      }
      onDatePress={() => {
        Analytics.clickPeriodCalendarButton();
        setOpenModal(true);
      }}
      title={`쿠키와 함께 돌아보는\n내 감정의 흐름`}
      modalComponent={
        <RangeDatePickerModal
          modalVisible={openModal}
          onClose={() => setOpenModal(false)}
          onChange={onChange}
          range={range}
        />
      }>
      <Container>
        {periodKeywordList && periodKeywordList.length > 0 && (
          <>
            <NewPeriodFlowChartArea emotionsData={emotionsData} />
            <NewPeriodEmotionArea periodEmotionList={totalEmotions} />
            <NewPeriodKeywordArea periodKeywordList={periodKeywordList} />
          </>
        )}

        {recordEmotions && recordEmotions?.records.length > 0 ? (
          <PeriodRecord
            records={recordEmotions ? recordEmotions.records : []}
            hintStatus={hintStatus}
            setHintStatus={setHintStatus}
            navigation={navigation}
          />
        ) : (
          <EmptyBox
            mainTitle="이 기간에 작성한 일기가 없어요"
            subTitle="오늘의 감정 일기를 작성하고, 마음 보고서를 채워봐요"
            isLeftIcon={true}
            iconName="pencil"
            iconSize={40}
            onPress={() => {
              Analytics.clickCTADiaryButtonInPeriod();
              navigation.navigate(RootStackName.HomeStackNavigator, {
                screen: HomeStackName.SmallEmotionChart,
                params: { dateID: getDate(new Date()) },
              });
            }}
          />
        )}
        {periodKeywordList.length === 0 && (
          <EmptyBox
            mainTitle="이 기간에는 쿠키를 만나지 않았어요"
            subTitle="오늘 쿠키를 만나보러 가는건 어떠세요?"
            isLeftIcon={true}
            iconName="green-chat-icon"
            iconSize={40}
            onPress={() => {
              Analytics.clickCTADiaryButtonInPeriod();
              navigation.navigate(RootStackName.HomeStackNavigator, {
                screen: HomeStackName.NewChat,
              });
            }}
          />
        )}
      </Container>
    </StatisticLayout>
  );
};

export default PeriodStatisticPage;

/*

       {recordEmotions && recordEmotions?.records.length > 0 ? (
          <PeriodRecord
            records={recordEmotions ? recordEmotions.records : []}
            hintStatus={hintStatus}
            setHintStatus={setHintStatus}
            navigation={navigation}
          />
        ) : (
          <EmptyBox
            mainTitle="이 기간에 작성한 일기가 없어요"
            subTitle="오늘의 감정 일기를 작성하고, 마음 보고서를 채워봐요"
            isLeftIcon={true}
            iconName="pencil"
            iconSize={40}
            onPress={() => {
              Analytics.clickCTADiaryButtonInPeriod();
              navigation.navigate(RootStackName.HomeStackNavigator, {
                screen: HomeStackName.SmallEmotionChart,
                params: { dateID: getDate(new Date()) },
              });
            }}
          />
        )}
        {periodKeywordList.length === 0 && (
          <EmptyBox
            mainTitle="이 기간에는 쿠키를 만나지 않았어요"
            subTitle="오늘 쿠키를 만나보러 가는건 어떠세요?"
            isLeftIcon={true}
            iconName="green-chat-icon"
            iconSize={40}
            onPress={() => {
              Analytics.clickCTADiaryButtonInPeriod();
              navigation.navigate(RootStackName.HomeStackNavigator, {
                screen: HomeStackName.NewChat,
              });
            }}
          />
        )}

*/
