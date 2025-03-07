import { css } from '@emotion/native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Carousel } from 'react-native-ui-lib';
import { getCarousel } from '../../apis/carousel';
import { TCarousel } from '../../apis/carousel.types';
import { getRiskScore } from '../../apis/riskscore';
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
import EmotionBtn from '../../components/atoms/EmotionBtn/EmotionBtn';
import HomeChatBtn from '../../components/HomeBtn/HomeChatBtn';
import Header from './Homeheader';
import { getKoreanServerTodayDateString } from '../../utils/times';
import { useRiskStoreVer2 } from '../../store/useRiskStoreVer2';

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
  const [riskScore, setRiskScore] = React.useState<number>(0);
  const [riskStatus, setRiskStatus] = React.useState<'safe' | 'danger' | 'danger-opened'>('safe');
  const [carousels, setCarousels] = React.useState<TCarousel[]>(defaultHomeCarousel);
  const insets = useSafeAreaInsets();
  const { riskScoreV2, riskStatusV2, setRiskScoreV2, setRiskStatusV2, setHandleDangerPressV2 } =
    useRiskStoreVer2();

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
    navigation.navigate(RootStackName.HomeStackNavigator, {
      screen: HomeStackName.NewChat,
    });
  }, []);

  //헤더 아이콘 클릭했을 때 이동 페이지
  const handleDangerPress = () => {
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
  };

  //api 호출을 하여 위험 점수를 갱신하는 함수
  const refreshRiskScore = () => {
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
  };

  //점수를 불러와서 "위험 상태"를 갱신함
  const refreshRiskStatus = () => {
    const riskData = getRiskData();
    if (!riskData) setRiskStatus('safe');
    else if (riskData.isRead) setRiskStatus('danger-opened');
    else setRiskStatus('danger');
  };

  /*
    홈 화면으로 포커스 될 때마다 위험 점수를 갱신한다.
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setRiskScoreV2);
    //스크린이 포커스 될 때마다 refreshRiskScore 함수를 실행하여 위험 상태를 safe / danger / danger-opened 로 변경한다
    return () => {
      // 컴포넌트 unmount 시 리스너를 해제
      unsubscribe();
    };
  }, [navigation]);

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
            gap: ${rsHeight * 20 + 'px'};
          `}>
          <Header riskStatus={riskStatusV2} onIconPress={setHandleDangerPressV2} />
          <Carousel
            key={carousels.length}
            containerStyle={css`
              height: ${rsHeight * 112 + 'px'};
              border-radius: ${ratio * 20 + 'px'};
              overflow: hidden;
            `}
            loop
            initialPage={0}
            autoplay
            autoplayInterval={5 * 1000}>
            {carousels.map((carousel, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={1}
                onPress={() => {
                  Analytics.clickTabHomeCarousel(carousel.image);
                  WebBrowser.openBrowserAsync(carousel.url);
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  contentFit="cover"
                  source={{ uri: carousel.image }}
                />
              </TouchableOpacity>
            ))}
          </Carousel>

          <HomeChatBtn navigation={navigation} />

          <EmotionBtn navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
