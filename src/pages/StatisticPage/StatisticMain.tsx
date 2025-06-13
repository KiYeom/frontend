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
import EmptyBox from '../../components/emptybox/emptyBox';
import Header from '../../components/header/header';
import BottomTabNavigator from '~/src/navigators/BottomTabNavigator';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import StatisticLayout from '../../components/layout/StatisticLayout';
const START_HOUR_OF_DAY = 6;

const HINT_NAME = 'main';
const HINT_MESSAGE =
  '쿠키와의 대화를 통해 나의 감정을 객관적으로 확인하고 그날의 자신을 돌아볼 수 있어요!\n※ 일일 보고서는 매일 오전 6시에 갱신돼요.\n※ 본 보고서는 참고용이며, 필요 시 전문가와 상의하세요.';

//전체 통계 화면
const StatisticMain: React.FC<any> = ({ navigation, route }) => {
  //const [date, setDate] = useState<Date>(new Date()); //서버에서 계산하는 날짜
  //const [date, setDate] = useState();
  const [openModal, setOpenModal] = React.useState(false);
  const [isNullClassification, setIsNullClassification] = useState(true);
  const [labelsClassification, setLabelsClassification] = useState<TLabel[]>([]);
  const [isSummaryList, setIsSummaryList] = useState(true);
  const [isRecordKeywordList, setIsRecordKeywordList] = useState<TEmotionCheck[]>([]);
  const [isNullRecordKeywordList, setIsNullRecordKeywordList] = useState(true);
  const [summaryList, setSummaryList] = useState<string[]>([]);
  const [todayFeeling, setTodayFeeling] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [hintStatus, setHintStatus] = useState<
    'emotion' | 'keyword' | 'record' | 'daily' | 'main' | undefined
  >(undefined);
  //const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  //const { dateID } = route.params;
  const [dateID, setDateID] = useState(route.params.dateID);
  //console.log('홈에서 받은 dateID', dateID);

  const onChange = useCallback((newDate) => {
    //setDate(new Date(newDate));
    setDateID(getKoreanRealDateString(newDate));
  }, []);

  //캐러셀 추가
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

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
    //setDate(new Date(`${getKoreanServerYesterdayDateString(new Date())}T00:00:00.000+09:00`));
  }, []);

  const fetchData = async () => {
    //console.log('fetchData date: ', date);
    //console.log('fetchData date: ', new Date());
    // const dailyStatistics = await dailyAnalyze(getKoreanRealDateString(date)); //date -> new Date()
    const dailyStatistics = await dailyAnalyze(dateID); //대화 기반으로 분석된 감정 결과 가져옴
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
    setImages(dailyStatistics.record.images ?? []);
    //console.log('😀😀😀😀😀😀😀😀', dailyStatistics.record.todayFeeling);
  };

  //날짜가 바뀜에 따라 데이터를 다시 api를 통해 불러옴
  useEffect(() => {
    fetchData();
  }, [dateID]);
  //console.log('🎨🎨🎨🎨🎨🎨Rendering statistic🎨🎨🎨🎨🎨🎨');
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
      {/* 이 부분이 children으로 전달됨 */}
      <Container>
        {!isNullClassification && (
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
        )}
        {(!isNullRecordKeywordList || todayFeeling !== '') && (
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
        )}
        {images.length > 0 && (
          <View style={{ position: 'relative', gap: rsHeight * 12 }}>
            <Text
              style={{
                fontFamily: 'Kyobo-handwriting',
                fontSize: 18 * rsFont,
                color: palette.neutral[900],
              }}>
              그 때 내가 기록한 순간을 담았어요!
            </Text>

            <Carousel
              ref={ref}
              width={rsWidth * 350}
              height={rsHeight * 263}
              data={images}
              onProgressChange={progress}
              defaultIndex={0}
              loop={images.length > 1 ? true : false}
              enabled={images.length > 1 ? true : false}
              style={{
                borderRadius: 10,
                overflow: 'hidden',
              }}
              renderItem={({ item }) => (
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  contentFit="cover"
                  source={{ uri: item }}
                />
              )}
            />
            {images.length > 1 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  right: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Pagination.Basic
                  progress={progress}
                  data={images}
                  dotStyle={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 50 }}
                  activeDotStyle={{ backgroundColor: '#FFFFFF' }}
                  containerStyle={{ gap: 5 }}
                  onPress={onPressPagination}
                />
              </View>
            )}
          </View>
        )}
        {isNullClassification && (
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
        {isNullRecordKeywordList && (
          <EmptyBox
            mainTitle="나에게 어떤 하루였나요?"
            subTitle="감정 일기를 작성하고, 마음 보고서를 완성해보세요"
            isLeftIcon={true}
            iconName="pencil"
            iconSize={40}
            onPress={() => {
              //console.log('누름');
              navigation.navigate(RootStackName.HomeStackNavigator, {
                screen: HomeStackName.SmallEmotionChart,
                params: { dateID: dateID },
              });
            }}
          />
        )}
      </Container>
    </StatisticLayout>
  );
};

export default StatisticMain;
