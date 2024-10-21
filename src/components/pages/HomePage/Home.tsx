import { css } from '@emotion/native';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Carousel } from 'react-native-ui-lib';
import { getCarousel } from '../../../apis/carousel';
import { TCarousel } from '../../../apis/carousel.types';
import requestNotificationPermission from '../../../utils/NotificationToken';
import { ratio, rsHeight, rsWidth } from '../../../utils/responsive-size';
import EmotionBtn from '../../atoms/EmotionBtn/EmotionBtn';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import Icon from '../../icons/icons';
import Header from './Homeheader';

const RISK_SCORE_THRESHOLD = 85;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

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
  const [icon, setIcon] = React.useState<string | null>(null);
  const [carousels, setCarousels] = React.useState<TCarousel[]>(defaultHomeCarousel);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    //console.log('home 화면');
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
  /*
1. 앱을 켤 때 위험 점수를 가져온다.
2. 위험 점수가 85점 이상이면:
    * (False, 타임스탬프) : 24시간 내로 확인한 적이 없다면: 날아다니는 메시지 아이콘을 보여준다. 
    * (True, 타임스탬프) : 24시간 내로 확인한 적이 있다면: 오픈한 메시지 아이콘을 보여준다.
3. 위험 점수가 85점 이하이면: 
    * 로컬스토리지에 값이 있으면 : 24시간 내에 위험 점수가 85점 이상인 적이 있었다면: 깐 메시지 아이콘을 보여준다. 
        * 타임스탬프 <- 현재 시간과 24시간 차이가 나나 확인해서 24시간 이내인 경우
    * 로컬스토리지 텅 : 24시간 내에 위험 점수가 85점 이상인 적이 없었다면: 하트 아이콘을 보여준다. 
        * 로컬에 타임스탬프가 없다면

로컬 스토리지 저장 방식 : 메세지 확인 시점의 UTC 타임스탬프를 저장한다 <- 객체 형태 (확인 여부, 타임스탬프)
*/
  const getRiskScore = async (): Promise<number> => {
    // 위험 점수를 가져오는 API 호출
    return 10;
  };
  useEffect(() => {
    const fetchRiskScore = async () => {
      // 위험 점수 api 로 가져오기
      const fetchedRiskScore = await getRiskScore();
      setRiskScore(fetchedRiskScore);

      /*const storedData = getRiskData(); //저장됐던 데이터
      const currentTime = new Date().getTime(); //현재 시간


      // 위험 점수가 85점 이상인 경우
      if (fetchedRiskScore >= RISK_SCORE_THRESHOLD) {
        if (storedData) {
          //저장된 데이터가 있을 때
          const { checked, timestamp } = JSON.parse(storedData);
          //24시간 내에 확인한 적이 있으면
          if (checked && currentTime - timestamp < ONE_DAY_IN_MS) {
            setIcon('openMessageIcon');
          } else {
            //24시간 내에 확인한 적이 없다면
            setIcon('flyingMessageIcon');
          }
        } else {
          //위험이 감지된 적이 없다면
          setIcon('flyingMessageIcon');
        }
      } else {
        //위험 점수가 85점 이하인 경우 (안위험한 상태)
        if (storedData) {
          //저장된 데이터가 있을 때 = 이전에 위험했을 때
          const { timestamp } = JSON.parse(storedData);
          if (currentTime - timestamp < ONE_DAY_IN_MS) {
            setIcon('openedMessageIcon');
          } else {
            setIcon('heartIcon');
          }
        } else {
          setIcon('heartIcon');
        }
      }*/
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
          <Header navigation={navigation} />

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
          <View>
            <Text>Risk Score: {riskScore}</Text>
            {riskScore !== null && (
              <Icon
                name={riskScore >= RISK_SCORE_THRESHOLD ? 'danger-sign' : 'danger-sign-opened'}
              />
            )}
          </View>

          <HomeChatBtn navigation={navigation} />

          <EmotionBtn navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
