import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze, dailyAnalyzeStatus } from '../../apis/analyze';
import { TEmotionCheck, TLabel } from '../../apis/analyze.type';
import { HomeStackName, RootStackName, TabScreenName } from '../../constants/Constants';
import Analytics from '../../utils/analytics';
import SingleDatePickerModal from '../../components/rangeCal/single-date-picker-modal';
import DailyEmotionClassification from './Daily_EmotionClassification/DailyEmotionClassification';
import EmotionArea from './Daily_Keyword/EmotionArea';
import EmotionDairy from './Daily_Keyword/EmotionDairy';
import KeywordArea from './Daily_Keyword/KeywordArea';
import { formatDateKorean } from '../../utils/times';
import { Container } from './StatisticMain.style';
import { getKoreanRealDateString, getKoreanServerTodayDateString } from '../../utils/times';
import CTAButton from '../../components/CTAButton/CTAButton';
import StatisticLayout from '../../components/layout/StatisticLayout';
import DailyGallery from './Daily_Gallery/DailyGallery';
import AnaylsisBlock from './AnalysisBlock/AnalysisBlock';

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
  //홈 화면 혹은 날짜 선택 모달에서 받은 날짜 ID
  const [dateID, setDateID] = useState(route.params.dateID);

  const onChange = useCallback((newDate) => {
    setDateID(getKoreanRealDateString(newDate));
  }, []);

  //앱이 처음 실행됐을 때 실행되는 부분
  useEffect(() => {
    Analytics.watchDailyStatisticScreen(); //일일 리포트 화면 진입
    const initializeData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const data = await dailyAnalyzeStatus(currentYear);
        if (!data) {
          setAvailableDates([getKoreanServerTodayDateString(new Date())]);
        } else {
          setAvailableDates([...data.dates, getKoreanServerTodayDateString(new Date())]);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        alert('네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.');
      } finally {
      }
    };
    initializeData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching daily statistics:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
    }
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
      rightIcon="edit-icon"
      rightFunction={navigateToSmallEmotionChart}
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
        {/* ai 가 분석한 나의 모습 (그래프) */}
        {!isNullClassification && (
          <AnaylsisBlock title={'쿠키가 생각했을 때의 모습이에요'}>
            <DailyEmotionClassification labelsClassification={labelsClassification} />
          </AnaylsisBlock>
        )}
        {/* ai 가 분석한 나의 모습 (대화 키워드 분석) */}
        {!isSummaryList && (
          <AnaylsisBlock title={'쿠키와 이런 이야기를 했어요'}>
            <KeywordArea summaryList={summaryList} />
          </AnaylsisBlock>
        )}
        {/* 내가 직접 작성한 나의 모습 */}
        {!isNullRecordKeywordList && (
          <>
            <AnaylsisBlock title={'그 때의 나는 어떤 감정이었나요?'}>
              <EmotionArea isRecordKeywordList={isRecordKeywordList} />
            </AnaylsisBlock>
            <AnaylsisBlock title={'그 때의 나는 어떤 생각을 했을까요?'}>
              <EmotionDairy todayFeeling={todayFeeling} />
            </AnaylsisBlock>
          </>
        )}

        {/*(추가) 일기에 사진을 첨부한 경우)*/}
        {images.length > 0 && (
          <AnaylsisBlock title={'그 때 내가 기록한 순간을 담았어요!'}>
            <DailyGallery images={images} />
          </AnaylsisBlock>
        )}

        {/* 대화가 없어 ai 가 분석한 나의 모습이 존재하지 않는 경우 */}
        {isNullClassification && isSummaryList && (
          <CTAButton
            mainTitle="쿠키에게 고민을 말해보세요"
            subTitle="쿠키와의 대화가 부족해 마음을 들여다 볼 수 없었어요"
            iconName="green-chat-icon"
            onPress={navigateToNewChat}
          />
        )}
        {/* 내가 직접 작성한 나의 모습이 없는 경우 */}
        {isNullRecordKeywordList && (
          <CTAButton
            mainTitle="나에게 어떤 하루였나요?"
            subTitle="감정 일기를 작성하고, 마음 보고서를 완성해보세요"
            iconName="pencil"
            onPress={navigateToSmallEmotionChart}
          />
        )}
      </Container>
    </StatisticLayout>
  );
};

export default StatisticMain;
