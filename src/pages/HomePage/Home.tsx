import { css } from '@emotion/native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { getCarousel } from '../../apis/carousel';
import { TCarousel } from '../../apis/carousel.types';
import { getRiskScore } from '../../apis/riskscore';
import StreakCard from '../../components/streak/streak';
import {
  DANGER_LETTER,
  DangerStackName,
  HomeStackName,
  ONE_DAY_IN_MS,
  RISK_SCORE_THRESHOLD,
  RootStackName,
} from '../../constants/Constants';
import Analytics from '../../utils/analytics';
import requestNotificationPermission from '../../utils/NotificationToken';
import { ratio, rsHeight, rsWidth } from '../../utils/responsive-size';
import { getRiskData, getUserAccountProvider, setRiskData } from '../../utils/storageUtils';
import Header from './Homeheader';
import { getKoreanServerTodayDateString } from '../../utils/times';
import { useRiskStoreVer2 } from '../../store/useRiskStoreVer2';
import CustomCalendar from '../../components/customCalendar/customCalendar';
import { dailyEmotionAnalyze } from '~/src/apis/analyze';
import Button from '../../components/button/button';
import Streak from '../../components/streak/streak';
import { getUserDiaryStreak } from '../../apis/user-streak';
import ActionButton from '../../components/action-button/action-button';
const defaultHomeCarousel = [
  {
    page: 1,
    image:
      'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/home/banners/feedback.png',
    url: 'https://pf.kakao.com/_mTvtG/chat',
  },
  {
    page: 2,
    image:
      'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/home/banners/instagram.png',
    url: 'https://www.instagram.com/remind_cookie/',
  },
];

const Home: React.FC<any> = ({ navigation }) => {
  //console.log('홈 화면 렌더링 🏠');
  //const [riskScore, setRiskScore] = React.useState<number>(0);
  //const [riskStatus, setRiskStatus] = React.useState<'safe' | 'danger' | 'danger-opened'>('safe');
  const [carousels, setCarousels] = React.useState<TCarousel[]>(defaultHomeCarousel);
  const [currentStreak, setCurrentStreak] = React.useState<number>(0); //현재 연속 기록 일수
  const [maxStreak, setMaxStreak] = React.useState<number>(0); //최장 연속 기록 일수
  const insets = useSafeAreaInsets();
  const { riskScoreV2, riskStatusV2, setRiskScoreV2, setRiskStatusV2, setHandleDangerPressV2 } =
    useRiskStoreVer2();

  const width = Dimensions.get('window').width - 40;
  const rsHeight = 1; // 비율 계산 예시
  const ratio = 1; // 비율 계산 예시

  //캐러셀 추가 (페이지네이션)
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  //위험 상태에 따른 클릭 이벤트 처리 (쿠키 편지로 이동)
  const navigateToDangerAlert = () => {
    setHandleDangerPressV2();
    navigation.navigate(RootStackName.DangerStackNavigator, {
      screen: DangerStackName.DangerAlert,
      params: { letterIndex: getRiskData()?.letterIndex ?? 0 },
    });
  };

  useEffect(() => {
    Analytics.watchTabHomeScreen();
    requestNotificationPermission();
    getCarousel('home')
      .then((res) => {
        if (!res || res.length === 0) return;
        setCarousels(res);
      })
      .catch((error: any) => {
        console.error('[ERROR] homeCarousel: ', error);
      });
    /*navigation.navigate(RootStackName.HomeStackNavigator, {
      screen: HomeStackName.NewChat,
    });*/
  }, []);

  useEffect(() => {
    getUserDiaryStreak()
      .then((res) => {
        console.log('user-streak 정보', res);
        if (res) {
          setCurrentStreak(res.currentStreak);
          setMaxStreak(res.maxStreak);
        }
      })
      .catch((error) => {
        console.error('user-streak 정보 가져오기 실패', error);
      });
  }, []);

  //홈 화면으로 포커스 될 때마다 위험 점수를 갱신한다.
  /*useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setRiskScoreV2);
    return () => {
      unsubscribe();
    };
  }, [navigation]);*/

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={css`
            padding-horizontal: ${rsWidth * 20 + 'px'};
            padding-bottom: ${rsWidth * 20 + 'px'};
            flex: 1;
            gap: ${rsHeight * 15 + 'px'}; //gap 20 -> 15
            //background-color: blue;
          `}>
          <Header
            riskStatus={riskStatusV2}
            onIconPress={() => {
              switch (riskStatusV2) {
                case 'safe':
                  Analytics.clickClinicInfoButton(riskScoreV2);
                  WebBrowser.openBrowserAsync(
                    'https://autumn-flier-d18.notion.site/1268e75d989680f7b4f2d63d66f4a08a?pvs=4',
                  );
                  return;
                case 'danger':
                  Analytics.clickDangerLetterButton(riskScoreV2);
                  break;
                case 'danger-opened':
                  Analytics.clickOpenedDangerLetterButton(riskScoreV2);
                  break;
              }
              navigateToDangerAlert();
            }}
          />

          {/* 캐러셀 */}
          <View style={{ position: 'relative' }}>
            <Carousel
              ref={ref}
              width={width}
              height={rsHeight * 100} //112 -> 100
              data={carousels}
              onProgressChange={progress}
              defaultIndex={0}
              autoPlay
              autoPlayInterval={2500}
              loop
              enabled
              style={{
                borderRadius: ratio * 20,
                overflow: 'hidden',
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    Analytics.clickTabHomeCarousel(item.image);
                    WebBrowser.openBrowserAsync(item.url);
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    contentFit="cover"
                    source={{ uri: item.image }}
                  />
                </TouchableOpacity>
              )}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                left: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center',
                //backgroundColor: 'pink',
              }}>
              <Pagination.Basic
                progress={progress}
                data={carousels}
                dotStyle={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 50 }}
                activeDotStyle={{ backgroundColor: '#FFFFFF' }}
                containerStyle={{ gap: 5 }}
                onPress={onPressPagination}
              />
            </View>
          </View>

          {/* 스트릭 */}
          <View
            style={{
              //backgroundColor: 'pink',
              height: 60,
              flexDirection: 'row',
              gap: 10,
            }}>
            <StreakCard icon="fire" value={`${currentStreak}일`} label="연속 일기 기록수" />
            <StreakCard icon="twinkle-cookie" value={`${maxStreak}일`} label="최장 일기 기록수" />
          </View>

          {/* 캘린더 변경 */}
          <CustomCalendar navigation={navigation} />
        </View>
      </ScrollView>
      {/* 행복 버튼 */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderRadius: 50,
          //backgroundColor: 'white',
        }}>
        <ActionButton
          onPress={() => {
            navigation.navigate(RootStackName.HomeStackNavigator, {
              screen: HomeStackName.Quote,
            });
          }}></ActionButton>
      </View>
    </View>
  );
};

export default Home;

//헤더 아이콘 클릭했을 때 이동 페이지
/*const handleDangerPress = () => {
    if (riskStatus === 'danger') {
      Analytics.clickDangerLetterButton(riskScore);
      const letterIndex = Math.floor(Math.random() * DANGER_LETTER.length);
      setRiskData({
        timestamp: new Date().getTime(),
        isRead: true,
        letterIndex,
      });
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
        params: { letterIndex },
      }); //쿠키 편지 화면으로 이동한다
      return;
    }
    if (riskStatus === 'danger-opened') {
      //위험한 상태일 때 확인을 했으면
      Analytics.clickOpenedDangerLetterButton(riskScore);
      const letterIndex = getRiskData()?.letterIndex;
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
        params: { letterIndex: letterIndex ?? 0 },
      }); //쿠키 편지 화면으로 이동한다
      return;
    }
    if (riskStatus === 'safe') {
      //상담 기관 안내
      Analytics.clickClinicInfoButton(riskScore);
      WebBrowser.openBrowserAsync(
        'https://autumn-flier-d18.notion.site/1268e75d989680f7b4f2d63d66f4a08a?pvs=4',
      );
    }
  };*/

//api 호출을 하여 위험 점수를 갱신하는 함수
/*const refreshRiskScore = () => {
    const date = getKoreanServerTodayDateString(new Date());
    getRiskScore(date).then((res) => {
      setRiskScore(res); //점수를 저장
      if (res >= RISK_SCORE_THRESHOLD && !getRiskData()) {
        setRiskData({
          timestamp: new Date().getTime(),
          isRead: false,
          letterIndex: null,
        });
      }
      refreshRiskStatus();
    });
  };*/

//점수를 불러와서 "위험 상태"를 갱신함
/*const refreshRiskStatus = () => {
    const riskData = getRiskData();
    if (!riskData) setRiskStatus('safe');
    else if (riskData.isRead) setRiskStatus('danger-opened');
    else setRiskStatus('danger');
  };*/
