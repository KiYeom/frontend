import { css } from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  periodChart,
  periodKeyword,
  periodRecordEmotions,
  periodTotalEmotion,
} from '../../apis/analyze';
import { TPeriodRecordEmotions } from '../../apis/analyze.type';
import palette from '../../assets/styles/theme';
import Analytics from '../../utils/analytics';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import RangeDatePickerModal from '../../components/rangeCal/range-date-picker-modal';
import PeriodRecord from './Period-records/period-record';
import PeriodFlowChart from './Period_FlowChart/PeriodFlowChartArea';
import PeriodKeywordArea from './Period_keyword/PeriodKeywordArea';
import ReportType from './ReportType';
import { DateLineContainer, DateLineText, StatisticTitle } from './StatisticMain.style';
import Icon from '../../components/icons/icons';
import PeriodEmotionArea from './Period_Emotion/PeriodEmotionArea';
import Header from '../../components/header/header';
import EmptyBox from '../../components/emptybox/emptyBox';
import { RecordedEmotion } from '../HomePage/diary/EmotionChart.style';
import { RootStackName, HomeStackName } from '../../constants/Constants';

const HINT_NAME = 'main';
const HINT_MESSAGE =
  '그동안 쿠키와의 대화를 통해 나의 감정 변화를 확인하고, 대화 주제 및 나의 기록을 통해 지난 날의 자신을 돌아보세요!\n※ 본 보고서는 참고용이며, 필요 시 전문가와 상의하세요.';

const PeriodStatisticPage: React.FC<any> = () => {
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

        const [res, res2, res3, res4] = await Promise.all([
          periodChart(startDateFormatted, endDateFormatted), //기간 감정 차트
          periodKeyword(startDateFormatted, endDateFormatted), //기간 키워드 리스트
          periodRecordEmotions(startDateFormatted, endDateFormatted), //기간 기록한 감정들
          periodTotalEmotion(startDateFormatted, endDateFormatted), //기간 기록한 감정들
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
        //padding-top: ${insets.top + 'px'};
      `}>
      <Header title={'나의 감정 타임라인'} bgcolor={`${palette.neutral[50]}`} />
      <ScrollView>
        <View
          style={css`
            gap: ${rsHeight * 16 + 'px'};
            margin-vertical: ${rsHeight * 12 + 'px'};
            //background-color: pink;
            justify-content: center;
            align-items: center;
          `}>
          <View
            style={{
              //backgroundColor: 'yellow',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="calendar" width={70} height={70} />
            <View style={{ marginVertical: 10 * rsHeight }}>
              <DateLineContainer onPress={() => setOpenModal(true)}>
                <DateLineText>
                  {range.startDate && range.endDate
                    ? `${dayjs(range.startDate).locale(locale).format('YYYY년 M월 D일')}  ~ ${dayjs(range.endDate).locale(locale).format('YYYY년 M월 D일')}`
                    : '날짜를 선택해주세요'}
                </DateLineText>
                <Icon name="arrow-down" color={'white'} />
              </DateLineContainer>
              <StatisticTitle>
                쿠키와 함께 돌아보는
                {'\n'}내 감정의 흐름
              </StatisticTitle>
            </View>
          </View>
          {periodKeywordList && periodKeywordList.length > 0 && (
            <>
              <PeriodFlowChart
                emotionsData={emotionsData}
                startDate={dayjs(range.startDate).format('YYYY-MM-DD')}
                endDate={dayjs(range.endDate).format('YYYY-MM-DD')}
                hintStatus={hintStatus}
                setHintStatus={(hint: 'period-flow' | undefined) => {
                  setHintStatus(hint);
                }}
              />
              <PeriodEmotionArea
                periodEmotionList={totalEmotions}
                hintStatus={hintStatus}
                setHintStatus={(hint: 'period-emotion' | undefined) => {
                  setHintStatus(hint);
                }}
              />
              <PeriodKeywordArea
                periodKeywordList={periodKeywordList}
                hintStatus={hintStatus}
                setHintStatus={(hint: 'period-keyword' | undefined) => {
                  setHintStatus(hint);
                }}
              />
            </>
          )}

          {recordEmotions && recordEmotions?.records.length > 0 ? (
            <PeriodRecord
              records={recordEmotions ? recordEmotions.records : []}
              hintStatus={hintStatus}
              setHintStatus={setHintStatus}
            />
          ) : (
            <EmptyBox
              mainTitle="나에게 어떤 하루였나요?"
              subTitle="감정 일기를 작성하고, 마음 보고서를 완성해보세요"
              isLeftIcon={true}
              iconName="pencil"
              iconSize={40}
              onPress={() =>
                navigation.navigate(RootStackName.HomeStackNavigator, {
                  screen: HomeStackName.SmallEmotionChart,
                  params: { dateID: dateID },
                })
              }
            />
          )}
          {periodKeywordList.length === 0 && (
            <EmptyBox
              mainTitle="쿠키에게 고민을 말해보세요"
              subTitle="쿠키와의 대화가 부족해 마음을 들여다 볼 수 없었어요"
              isLeftIcon={true}
              iconName="green-chat-icon"
              iconSize={40}
              onPress={() =>
                navigation.navigate(RootStackName.HomeStackNavigator, {
                  screen: HomeStackName.NewChat,
                })
              }
            />
          )}
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
