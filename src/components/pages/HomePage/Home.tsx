import { css } from '@emotion/native';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Carousel } from 'react-native-ui-lib';
import { getCarousel } from '../../../apis/carousel';
import { TCarousel } from '../../../apis/carousel.types';
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

const Home: React.FC<any> = ({ navigation }) => {
  const [riskScore, setRiskScore] = React.useState<number | null>(null);
  const [icon, setIcon] = React.useState<string | null>();
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
  const handleIconPress = async () => {
    console.log('헤더 아이콘 점수', icon);
    if (icon === 'danger-sign') {
      //위험한 상태일 때 클릭을 했으면
      setIcon('danger-sign-opened'); //아이콘을 danger-sign-opend로 바꾸고
      const currentTime = new Date().getTime();
      saveRiskData(true, currentTime); //확인했으니까 true로
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
      }); //쿠키 편지 화면으로 이동한다
      return;
    } else if (icon === 'danger-sign-opened') {
      //이미 열어본 상태면
      //const currentTime = new Date().getTime();
      //saveRiskData(true, currentTime); //현재 시간을 저장하고
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
      }); //쿠키 편지 화면으로 이동한다
    } else {
      //상담 기관 안내
      Linking.openURL(
        'https://autumn-flier-d18.notion.site/1268e75d989680f7b4f2d63d66f4a08a?pvs=4',
      ); //24시간 넘은 경우 -> 상담소로
    }
  };

  const getRiskScore = async (): Promise<number> => {
    // 위험 점수를 가져오는 API 호출
    return 95;
  };

  //헤더 아이콘 설정하기
  useEffect(() => {
    const fetchRiskScore = async () => {
      //clearRiskData();
      // 위험 점수 api 로 가져오기
      const fetchedRiskScore = await getRiskScore(); //현재 위험 점수를 가지고 오는 api 호출
      setRiskScore(fetchedRiskScore);
      console.log('점수', fetchedRiskScore);

      const storedData = getRiskData();
      console.log('storeageData', storedData); // 저장됐던 데이터 출력
      const currentTime = new Date().getTime(); // 현재 시간
      console.log('currentTime!!!', currentTime); // 예: 1729486534728

      // 위험 점수가 85점 이상인 경우
      if (fetchedRiskScore >= RISK_SCORE_THRESHOLD) {
        console.log('하이');
        if (storedData) {
          //로컬 스토리지 확인
          //저장된 데이터가 있을 때
          const { isChecked, timestamp } = storedData;

          //메세지를 24시간 내로 확인했으면 (isChecked == true : 이전에 확인한 적 있음)
          if (isChecked && currentTime - timestamp < ONE_DAY_IN_MS) {
            setIcon('danger-sign-opened');
          } else {
            //메세지를 24시간 내로 확인을 안 했으면
            setIcon('danger-sign');
          }
        } else {
          console.log('로컬스토리지에 값이 없음');
          //로컬스토리지 확인
          //저장된 데이터가 없을 때 -> 위험 감지 안 된 상태 -> > 아이콘으로
          setIcon('danger-sign');
        }
      } else {
        // 위험 점수가 85점 이하인 경우 (안 위험한 상태)
        if (storedData) {
          // 저장된 데이터가 있을 때 = 이전에 위험했을 때
          console.log('이전에 위험한 적이 있었다');
          const { isChecked, timestamp } = storedData;
          console.log('isChekced timestamp', isChecked, timestamp);
          if (currentTime - timestamp < ONE_DAY_IN_MS) {
            if (isChecked) {
              //true 인 경우 = 확인한 경우
              setIcon('danger-sign-opened');
            } else {
              //false인 경우 = 확인한 적 없는 경우
              setIcon('danger-sign');
            }
          } else {
            //체크한 적 없었을 떄
            console.log('이전에 위험한 적이 없었다');
            setIcon(null);
          }
        }
      }
    };

    fetchRiskScore();
  }, []);

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
          <Header
            navigation={navigation}
            riskScore={riskScore}
            icon={icon}
            onIconPress={handleIconPress}
          />

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
                  Linking.openURL(carousel.url);
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
