import { css } from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze, dailyAnalyzeStatus } from '../../../apis/analyze';
import { TEmotionCheck, TLabel } from '../../../apis/analyze.type';
import palette from '../../../assets/styles/theme';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import Analytics from '../../../utils/analytics';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import SingleDatePickerModal from '../../rangeCal/single-date-picker-modal';
import BlurredButton from './BlurredButton';
import DailyEmotionClassification from './Daily_EmotionClassification/DailyEmotionClassification';
import EmotionArea from './Daily_Keyword/EmotionArea';
import EmotionDairy from './Daily_Keyword/EmotionDairy';
import KeywordArea from './Daily_Keyword/KeywordArea';
import ReportType from './ReportType';
import { Container, DateLineText, StatisticTitle } from './StatisticMain.style';
import { getIsDemo } from '../../../utils/storageUtils';
const START_HOUR_OF_DAY = 6;

const getServerYesterday = (currentDate: Date = new Date()) => {
  let utc = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  let koreaTime = new Date(utc + 9 * 60 * 60 * 1000); // UTC+9 시간대

  let hour = koreaTime.getHours();

  if (hour >= 0 && hour < START_HOUR_OF_DAY) {
    // 오전 0시에서 6시 사이라면 엊그제 출력 (2일전)
    koreaTime.setDate(koreaTime.getDate() - 2);
  } else {
    // 그렇지 않으면 어제 출력 (어제)
    koreaTime.setDate(koreaTime.getDate() - 1);
  }
  return koreaTime;
};

const getServerToday = (currentDate: Date = new Date()) => {
  let utc = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  let koreaTime = new Date(utc + 9 * 60 * 60 * 1000); // UTC+9 시간대

  let hour = koreaTime.getHours();

  if (hour >= 0 && hour < START_HOUR_OF_DAY) {
    // 오전 0시에서 6시 사이라면 엊그제 출력 (2일전)
    koreaTime.setDate(koreaTime.getDate() - 1);
  } else {
    // 그렇지 않으면 어제 출력 (어제)
    koreaTime.setDate(koreaTime.getDate());
  }
  return koreaTime;
};

const getDateString = (date: Date): string => {
  return (
    date?.getFullYear() +
    '년 ' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '월 ' +
    String(date.getDate()).padStart(2, '0') +
    '일'
  );
};

const getApiDateString = (date: Date): string => {
  return (
    date?.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
};

//전체 통계 화면
const StatisticMain: React.FC<any> = () => {
  const [date, setDate] = useState<Date | undefined>(getServerYesterday()); //서버에서 계산하는 날짜
  const [openModal, setOpenModal] = React.useState(false);
  const [isNullClassification, setIsNullClassification] = useState(true);
  const [labelsClassification, setLabelsClassification] = useState<TLabel[]>([]);
  const [isSummaryList, setIsSummaryList] = useState(true);
  const [isRecordKeywordList, setIsRecordKeywordList] = useState<TEmotionCheck[]>([]);
  const [isNullRecordKeywordList, setIsNullRecordKeywordList] = useState(true);
  const [summaryList, setSummaryList] = useState<string[]>([]);
  const [todayFeeling, setTodayFeeling] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const onChange = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  useEffect(() => {
    Analytics.watchDailyStatisticScreen();
    if (getIsDemo()) setDate(getServerToday());
    dailyAnalyzeStatus(2024).then((data) => {
      if (!data) return;
      if (getIsDemo()) {
        setAvailableDates([...data.dates, getApiDateString(getServerToday())]);
      } else {
        setAvailableDates(data.dates);
      }
    });
  }, []);

  const fetchData = async () => {
    const dailyStatistics = await dailyAnalyze(getApiDateString(date ?? getServerYesterday()));
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
  };

  //헤더 아이콘 설정하기
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
      if (getIsDemo()) setDate(getServerToday());
      dailyAnalyzeStatus(2024).then((data) => {
        if (!data) return;
        if (getIsDemo()) {
          setAvailableDates([...data.dates, getApiDateString(getServerToday())]);
        } else {
          setAvailableDates(data.dates);
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
              <DateLineText>{getDateString(date ?? getServerYesterday())}</DateLineText>
              <StatisticTitle>쿠키와의 대화에서{'\n'}마음을 살펴보았어요</StatisticTitle>
            </View>
          </View>
          <Container>
            {!isNullClassification ? (
              <>
                <DailyEmotionClassification
                  isNullClassification={isNullClassification}
                  labelsClassification={labelsClassification}
                />
                <KeywordArea isSummaryList={isSummaryList} summaryList={summaryList} />
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
                  isNullRecordKeywordList={isNullRecordKeywordList}
                />
                <EmotionDairy todayFeeling={todayFeeling} />
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
