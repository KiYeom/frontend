import { css } from '@emotion/native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Carousel } from 'react-native-ui-lib';
import { getCarousel } from '../../../apis/carousel';
import { TCarousel } from '../../../apis/carousel.types';
import { getRiskScore } from '../../../apis/riskscore';
import {
  DangerStackName,
  ONE_DAY_IN_MS,
  RISK_SCORE_THRESHOLD,
  RootStackName,
} from '../../../constants/Constants';
import requestNotificationPermission from '../../../utils/NotificationToken';
import { ratio, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getRiskData, saveRiskData } from '../../../utils/storageUtils';
import EmotionBtn from '../../atoms/EmotionBtn/EmotionBtn';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import Header from './Homeheader';

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

const getApiDateString = (date: Date): string => {
  return (
    date?.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
};

const Home: React.FC<any> = ({ navigation }) => {
  const [riskScore, setRiskScore] = React.useState<number>(0);
  const [riskStatus, setRiskStatus] = React.useState<'safe' | 'danger' | 'danger-opened'>('safe');
  const [carousels, setCarousels] = React.useState<TCarousel[]>(defaultHomeCarousel);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    requestNotificationPermission();
    getCarousel('home')
      .then((res) => {
        if (!res || res.length === 0) return;
        setCarousels(res);
      })
      .catch((error: any) => {
        console.error('[ERROR] homeCarousel: ', error);
      });
  }, []);

  //헤더 아이콘 클릭했을 때 이동 페이지
  const handleDangerPress = () => {
    console.log('위험 아이콘 클릭: ', riskStatus);
    if (riskStatus === 'danger' || riskStatus === 'danger-opened') {
      //위험한 상태일 때 클릭을 했으면
      saveRiskData(true, new Date().getTime());
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
      }); //쿠키 편지 화면으로 이동한다
      return;
    }
    if (riskStatus === 'safe') {
      //상담 기관 안내
      WebBrowser.openBrowserAsync(
        'https://autumn-flier-d18.notion.site/1268e75d989680f7b4f2d63d66f4a08a?pvs=4',
      );
    }
  };

  //헤더 아이콘 설정하기
  useEffect(() => {
    const fetchRiskScore = async () => {
      // 위험 점수 api 로 가져오기
      const date = getApiDateString(new Date());
      const fetchedRiskScore = await getRiskScore(date); //현재 위험 점수를 가지고 오는 api 호출
      setRiskScore(fetchedRiskScore);

      const storedData = getRiskData();
      const currentTime = new Date().getTime(); // 현재 시간

      // 위험 점수가 85점 이상인 경우
      if (fetchedRiskScore >= RISK_SCORE_THRESHOLD) {
        console.log('85점 이상임');
        if (storedData) {
          //로컬 스토리지 확인
          //저장된 데이터가 있을 때
          const { isChecked, timestamp } = storedData;

          //메세지를 24시간 내로 확인했으면 (isChecked == true : 이전에 확인한 적 있음)
          if (isChecked && currentTime - timestamp < ONE_DAY_IN_MS) {
            setRiskStatus('danger-opened');
          } else {
            //메세지를 24시간 내로 확인을 안 했으면
            setRiskStatus('danger');
          }
        } else {
          console.log('로컬스토리지에 값이 없음');
          //로컬스토리지 확인
          //85점 이상인데 로컬스토리지에 값이 없음 => 타임스탬프 저장해야 함
          setRiskStatus('danger');
          saveRiskData(false, new Date().getTime()); //확인했으니까 true로
        }
      } else {
        // 위험 점수가 85점 이하인 경우 (안 위험한 상태)
        if (storedData) {
          // 저장된 데이터가 있을 때 = 이전에 위험했을 때
          //console.log('이전에 위험한 적이 있었다');
          const { isChecked, timestamp } = storedData;
          //console.log('isChekced timestamp', isChecked, timestamp);
          if (currentTime - timestamp < ONE_DAY_IN_MS) {
            if (isChecked) {
              //true 인 경우 = 확인한 경우
              setRiskStatus('danger-opened');
            } else {
              //false인 경우 = 확인한 적 없는 경우
              setRiskStatus('danger');
            }
          } else {
            //체크한 적 없었을 떄
            //console.log('이전에 위험한 적이 없었다');
          }
        }
      }
    };

    // 화면이 focus될 때마다 실행
    const handleFocus = () => {
      console.log('홈화면 focus');
      fetchRiskScore(); // 데이터 fetch
    };

    const unsubscribe = navigation.addListener('focus', handleFocus);
    // 컴포넌트 unmount 시 리스너를 해제
    return () => {
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
          <Header navigation={navigation} riskStatus={riskStatus} onIconPress={handleDangerPress} />

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

          <HomeChatBtn navigation={navigation} riskScore={riskScore} />

          <EmotionBtn navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
