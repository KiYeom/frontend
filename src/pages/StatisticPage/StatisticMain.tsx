import { css } from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze, dailyAnalyzeStatus } from '../../apis/analyze';
import { TEmotionCheck, TLabel } from '../../apis/analyze.type';
import palette from '../../assets/styles/theme';
import { HomeStackName, RootStackName } from '../../constants/Constants';
import Analytics from '../../utils/analytics';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import SingleDatePickerModal from '../../components/rangeCal/single-date-picker-modal';
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
//import { Hint } from 'react-native-ui-lib';
import HintComponent from './HintComponent';
import Icon from '../../components/icons/icons';
import {
  getKoreanRealDateString,
  getKoreanServerTodayDateString,
  getKoreanServerYesterdayDateString,
} from '../../utils/times';
import EmptyBox from '../../components/emptybox/emptyBox';

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

  //앱이 처음 실행됐을 때 실행되는 부분
  useEffect(() => {
    Analytics.watchDailyStatisticScreen(); //일일 리포트 화면 진입
    dailyAnalyzeStatus(2025).then((data) => {
      //1.5.7 UPDATE 하드 코딩.. 2025년도에 대한 데이터를 가져옴
      if (!data) {
        setAvailableDates([getKoreanServerTodayDateString(new Date())]);
      } else {
        setAvailableDates([...data.dates, getKoreanServerTodayDateString(new Date())]);
      }
    });
    setDate(new Date(`${getKoreanServerYesterdayDateString(new Date())}T00:00:00.000+09:00`));
  }, []);

  const fetchData = async () => {
    //console.log('fetchData date: ', date);
    //console.log('fetchData date: ', new Date());
    // const dailyStatistics = await dailyAnalyze(getKoreanRealDateString(date)); //date -> new Date()
    const dailyStatistics = await dailyAnalyze('2025-03-14');
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
    //console.log('😀😀😀😀😀😀😀😀', dailyStatistics.record.todayFeeling);
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

  //날짜가 바뀜에 따라 데이터를 다시 api를 통해 불러옴
  useEffect(() => {
    //console.log('useEffect date');
    fetchData();
  }, [date]);
  //console.log('🎨🎨🎨🎨🎨🎨Rendering statistic🎨🎨🎨🎨🎨🎨');
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
            justify-content: center;
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
              {/* 현재 날짜와 쿠키의 안내 말 */}
              <DateLineContainer>
                <TouchableOpacity onPress={() => setOpenModal(true)}>
                  {/*<DateLineText>{getDateKoreanString(date)}</DateLineText> 1.5.7 UPDATE 잠시 주석 처리*/}
                  <DateLineText>2025년 03월 14일!</DateLineText>
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <HintComponent
                    visible={hintStatus && hintStatus === HINT_NAME}
                    onClose={() => setHintStatus(undefined)}
                    onToggle={() => setHintStatus(hintStatus ? undefined : HINT_NAME)}
                    message={HINT_MESSAGE}
                  />
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
            <EmptyBox
              mainTitle="나에게 어떤 하루였나요?"
              subTitle="감정 일기를 작성하고, 마음 보고서를 완성해보세요"
              isLeftIcon={true}
              iconName="pencil"
              iconSize={40}
            />
            <EmptyBox
              mainTitle="쿠키에게 고민을 말해보세요"
              subTitle="쿠키와의 대화가 부족해 마음을 들여다볼 수 없었어요"
              isLeftIcon={true}
              iconName="green-chat-icon"
              iconSize={40}
            />
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
