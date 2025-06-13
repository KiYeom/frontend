import { css } from '@emotion/native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze, dailyAnalyzeStatus } from '../../apis/analyze';
import { TEmotionCheck, TLabel } from '../../apis/analyze.type';
import palette from '../../assets/styles/theme';
import { HomeStackName, RootStackName, TabScreenName } from '../../constants/Constants';
import Analytics from '../../utils/analytics';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import SingleDatePickerModal from '../../components/rangeCal/single-date-picker-modal';
//import BlurredButton from './BlurredButton';
import DailyEmotionClassification from './Daily_EmotionClassification/DailyEmotionClassification';
import EmotionArea from './Daily_Keyword/EmotionArea';
import EmotionDairy from './Daily_Keyword/EmotionDairy';
import KeywordArea from './Daily_Keyword/KeywordArea';
//import ReportType from './ReportType';
import { formatDateKorean } from '../../utils/times';
import {
  Container,
  DateLineContainer,
  DateLineText,
  PageHintText,
  StatisticTitle,
} from './StatisticMain.style';
import Icon from '../../components/icons/icons';
import {
  getKoreanRealDateString,
  getKoreanServerTodayDateString,
  getKoreanServerYesterdayDateString,
} from '../../utils/times';
import CTAButton from '../../components/CTAButton/CTAButton';
import Header from '../../components/header/header';
import BottomTabNavigator from '~/src/navigators/BottomTabNavigator';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import StatisticLayout from '../../components/layout/StatisticLayout';
import DailyGallery from './Daily_Gallery/DailyGallery';
const START_HOUR_OF_DAY = 6;

//전체 통계 화면
const StatisticMain: React.FC<any> = ({ navigation, route }) => {
  const [openModal, setOpenModal] = React.useState(false); //날짜 선택 모달
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  //section1. 감정 분류
  const [isNullClassification, setIsNullClassification] = useState(true);
  const [labelsClassification, setLabelsClassification] = useState<TLabel[]>([]);
  //section2. 요약 키워드
  const [isSummaryList, setIsSummaryList] = useState(true);
  const [summaryList, setSummaryList] = useState<string[]>([]);
  const [isNullRecordKeywordList, setIsNullRecordKeywordList] = useState(true);
  //section3. 내가 선택한 감정 키워드
  const [isRecordKeywordList, setIsRecordKeywordList] = useState<TEmotionCheck[]>([]);
  //setction4. 내가 기록한 나의 일기
  const [todayFeeling, setTodayFeeling] = useState<string>('');
  //section5. 내가 기록한 나의 사진
  const [images, setImages] = useState<string[]>([]);
  //const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  //const { dateID } = route.params;
  const [dateID, setDateID] = useState(route.params.dateID);
  //console.log('홈에서 받은 dateID', dateID);

  const onChange = useCallback((newDate) => {
    //setDate(new Date(newDate));
    setDateID(getKoreanRealDateString(newDate));
  }, []);

  //앱이 처음 실행됐을 때 실행되는 부분
  useEffect(() => {
    Analytics.watchDailyStatisticScreen(); //일일 리포트 화면 진입
    const currentYear = new Date().getFullYear();
    dailyAnalyzeStatus(currentYear).then((data) => {
      if (!data) {
        setAvailableDates([getKoreanServerTodayDateString(new Date())]);
      } else {
        setAvailableDates([...data.dates, getKoreanServerTodayDateString(new Date())]);
      }
    });
  }, []);

  const fetchData = useCallback(async () => {
    const dailyStatistics = await dailyAnalyze(dateID);
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
    setTodayFeeling(dailyStatistics.record.todayFeeling ?? '');
    setImages(dailyStatistics.record.images ?? []);
  }, [dateID]);

  //날짜가 바뀜에 따라 데이터를 다시 api를 통해 불러옴
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navigateToNewChat = useCallback(() => {
    navigation.navigate(RootStackName.HomeStackNavigator, {
      screen: HomeStackName.NewChat,
    });
  }, [navigation]);

  const navigateToSmallEmotionChart = useCallback(() => {
    navigation.navigate(RootStackName.HomeStackNavigator, {
      screen: HomeStackName.SmallEmotionChart,
      params: { dateID },
    });
  }, [navigation, dateID]);
  console.log('StatisticMain 컴포넌트 실행됨');

  return (
    <StatisticLayout
      headerTitle="감정 다이어리"
      iconName="clover-cookie"
      dateText={formatDateKorean(dateID)}
      onDatePress={() => setOpenModal(true)}
      title={`쿠키와 함께 돌아보는\n어느 날의 감정`}
      modalComponent={
        <SingleDatePickerModal
          modalVisible={openModal}
          onClose={() => setOpenModal(false)}
          onChange={onChange}
          availableDates={availableDates}
        />
      }>
      {/* children으로 전달 */}
      <Container>
        {/* ai 가 분석한 나의 모습 */}
        {!isNullClassification && (
          <>
            <DailyEmotionClassification labelsClassification={labelsClassification} />
            <KeywordArea summaryList={summaryList} />
          </>
        )}
        {/* 내가 직접 작성한 나의 모습 */}
        {!isNullRecordKeywordList && (
          <>
            <EmotionArea isRecordKeywordList={isRecordKeywordList} />
            <EmotionDairy todayFeeling={todayFeeling} />
            <DailyGallery images={images} />
          </>
        )}

        {/* 대화가 없어 ai 가 분석한 나의 모습이 존재하지 않는 경우 */}
        {isNullClassification && (
          <CTAButton
            mainTitle="쿠키에게 고민을 말해보세요"
            subTitle="쿠키와의 대화가 부족해 마음을 들여다 볼 수 없었어요"
            iconName="pencil"
            onPress={navigateToNewChat}
          />
        )}
        {/* 내가 직접 작성한 나의 모습이 없는 경우 */}
        {isNullRecordKeywordList && (
          <CTAButton
            mainTitle="나에게 어떤 하루였나요?"
            subTitle="감정 일기를 작성하고, 마음 보고서를 완성해보세요"
            iconName="green-chat-icon"
            onPress={navigateToSmallEmotionChart}
          />
        )}
      </Container>
    </StatisticLayout>
  );
};

export default StatisticMain;
