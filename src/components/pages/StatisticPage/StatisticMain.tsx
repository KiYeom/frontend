import { css } from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze, dailyAnalyzeStatus } from '../../../apis/analyze';
import { TEmotionCheck, TLabel } from '../../../apis/analyze.type';
import palette from '../../../assets/styles/theme';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import Analytics from '../../../utils/analytics';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import SingleDatePickerModal from '../../rangeCal/single-date-picker-modal';
import BlurredButton from './BlurredButton';
import DailyEmotionClassification from './Daily_EmotionClassification/DailyEmotionClassification';
import EmotionArea from './Daily_Keyword/EmotionArea';
import EmotionDairy from './Daily_Keyword/EmotionDairy';
import KeywordArea from './Daily_Keyword/KeywordArea';
import ReportType from './ReportType';
import {
  Container,
  DateLineContainer,
  DateLineText,
  PageHintText,
  StatisticTitle,
} from './StatisticMain.style';
import { Hint } from 'react-native-ui-lib';
import Icon from '../../icons/icons';
import {
  getKoreanRealDateString,
  getKoreanServerTodayDateString,
  getKoreanServerYesterdayDateString,
} from '../../../utils/times';
import { getIsDemo } from '../../../utils/storageUtils';

const START_HOUR_OF_DAY = 6;

//checked at 24-11-25
const getDateKoreanString = (utcDate: Date): string => {
  const nowKoreanDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  return (
    nowKoreanDate?.getUTCFullYear() +
    '년 ' +
    String(nowKoreanDate.getUTCMonth() + 1).padStart(2, '0') +
    '월 ' +
    String(nowKoreanDate.getUTCDate()).padStart(2, '0') +
    '일'
  );
};

const HINT_NAME = 'main';
const HINT_MESSAGE =
  '쿠키와의 대화를 통해 나의 감정을 객관적으로 확인하고 그날의 자신을 돌아볼 수 있어요!\n※ 일일 보고서는 매일 오전 6시에 갱신돼요.\n※ 본 보고서는 참고용이며, 필요 시 전문가와 상의하세요.';

//전체 통계 화면
const StatisticMain: React.FC<any> = () => {
  const [date, setDate] = useState<Date>(new Date()); //서버에서 계산하는 날짜
  const [openModal, setOpenModal] = React.useState(false);
  const [isNullClassification, setIsNullClassification] = useState(true);
  const [labelsClassification, setLabelsClassification] = useState<TLabel[]>([]);
  const [isSummaryList, setIsSummaryList] = useState(true);
  const [isRecordKeywordList, setIsRecordKeywordList] = useState<TEmotionCheck[]>([]);
  const [isNullRecordKeywordList, setIsNullRecordKeywordList] = useState(true);
  const [summaryList, setSummaryList] = useState<string[]>([]);
  const [todayFeeling, setTodayFeeling] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [hintStatus, setHintStatus] = useState<
    'emotion' | 'keyword' | 'record' | 'daily' | 'main' | undefined
  >(undefined);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const onChange = useCallback((newDate) => {
    setDate(new Date(newDate));
  }, []);

  useEffect(() => {
    Analytics.watchDailyStatisticScreen();
    dailyAnalyzeStatus(2025).then((data) => {
      if (!data) {
        setAvailableDates([getKoreanServerTodayDateString(new Date())]);
      } else {
        setAvailableDates([...data.dates, getKoreanServerTodayDateString(new Date())]);
      }
    });
    if (getIsDemo()) {
      setDate(new Date(`${getKoreanServerTodayDateString(new Date())}T00:00:00.000+09:00`));
    } else {
      setDate(new Date(`${getKoreanServerYesterdayDateString(new Date())}T00:00:00.000+09:00`));
    }
  }, []);

  const fetchData = async () => {
    console.log('fetchData date: ', date);
    //console.log('fetchData date: ', new Date());
    const dailyStatistics = await dailyAnalyze(getKoreanRealDateString(date)); //date -> new Date()
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
    //빈 값 [] 이면 false를 넘겨주기 때문에 !을 붙여서 true로 만들어줌
    setTodayFeeling(dailyStatistics.record.todayFeeling ?? '');
    console.log('😀😀😀😀😀😀😀😀', dailyStatistics.record.todayFeeling);
  };

  //헤더 아이콘 설정하기
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dailyAnalyzeStatus(2025).then((data) => {
        if (!data) {
          setAvailableDates([getKoreanServerTodayDateString(new Date())]);
        } else {
          setAvailableDates([...data.dates, getKoreanServerTodayDateString(new Date())]);
        }
      });
    });
    // 컴포넌트 unmount 시 리스너를 해제
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
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
              Analytics.clickDailyCalendarButton();
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
              <DateLineContainer>
                <TouchableOpacity onPress={() => setOpenModal(true)}>
                  <DateLineText>{getDateKoreanString(date)}</DateLineText>
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Hint
                    visible={hintStatus && hintStatus === HINT_NAME}
                    position={Hint.positions.BOTTOM}
                    message={HINT_MESSAGE}
                    color={'white'}
                    enableShadow
                    messageStyle={css`
                      font-family: Kyobo-handwriting;
                      font-size: ${16 * rsFont + 'px'};
                      color: ${palette.neutral[900]};
                    `}
                    onPress={() => setHintStatus(undefined)}
                    onBackgroundPress={() => setHintStatus(undefined)}
                    backdropColor={'rgba(0, 0, 0, 0.5)'}>
                    <View>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
                        onPress={() => setHintStatus(hintStatus ? undefined : HINT_NAME)}>
                        <Icon name="information" width={14} height={14} />
                      </TouchableOpacity>
                    </View>
                  </Hint>
                </View>
              </DateLineContainer>
              <StatisticTitle>쿠키와의 대화에서{'\n'}마음을 살펴보았어요</StatisticTitle>
            </View>
          </View>
          <Container>
            {!isNullClassification ? (
              <>
                <DailyEmotionClassification
                  labelsClassification={labelsClassification}
                  hintStatus={hintStatus}
                  setHintStatus={(hint: 'emotion' | undefined) => {
                    setHintStatus(hint);
                  }}
                />
                <KeywordArea
                  summaryList={summaryList}
                  hintStatus={hintStatus}
                  setHintStatus={(hint: 'keyword' | undefined) => {
                    setHintStatus(hint);
                  }}
                />
              </>
            ) : (
              <>
                <BlurredButton
                  blurredImageUri={
                    'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/statistic/blurgraph.png'
                  }
                  text={'지금 쿠키와 대화하고\n내일 나의 마음을 확인해보세요'}
                  buttonText="쿠키랑 대화하기"
                  onPress={async () => {
                    Analytics.clickCTAChatButton();
                    navigation.navigate(RootStackName.HomeStackNavigator, {
                      screen: HomeStackName.NewChat,
                    });
                  }}
                />
              </>
            )}
            {!isNullRecordKeywordList || todayFeeling !== '' ? (
              <>
                <EmotionArea
                  isRecordKeywordList={isRecordKeywordList}
                  hintStatus={hintStatus}
                  setHintStatus={(hint: 'record' | undefined) => {
                    setHintStatus(hint);
                  }}
                />
                <EmotionDairy
                  todayFeeling={todayFeeling}
                  hintStatus={hintStatus}
                  setHintStatus={(hint: 'daily' | undefined) => {
                    setHintStatus(hint);
                  }}
                />
              </>
            ) : (
              <>
                <BlurredButton
                  blurredImageUri={
                    'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/statistic/sampleemotionkeyword.png'
                  }
                  text={'지금 내 마음속\n목소리를 들어볼까요?'}
                  buttonText="감정 일기 작성하기"
                  onPress={() => {
                    Analytics.clickCTADiaryButton();
                    navigation.navigate(RootStackName.HomeStackNavigator, {
                      screen: HomeStackName.SmallEmotionChart,
                    });
                  }}
                />
              </>
            )}
          </Container>
        </View>
      </ScrollView>
      <SingleDatePickerModal
        modalVisible={openModal}
        onClose={() => setOpenModal(false)}
        onChange={onChange}
        availableDates={availableDates}
      />
    </View>
  );
};

export default StatisticMain;
