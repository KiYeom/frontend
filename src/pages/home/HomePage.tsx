import { css } from '@emotion/native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ScrollView, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { getCarousel } from '../../apis/carousel';
import { TCarousel } from '../../apis/carousel.types';
import StreakCard from '../../components/streak/Streak';
import { DangerStackName, HomeStackName, RootStackName } from '../../constants/Constants';
import Analytics from '../../utils/analytics';
import requestNotificationPermission from '../../utils/NotificationToken';
import { ratio, rsHeight, rsWidth } from '../../utils/responsive-size';
import { getRiskData, getUserAccountProvider, setRiskData } from '../../utils/storageUtils';
import Header from './Homeheader';
import { useRiskStoreVer2 } from '../../store/useRiskStoreVer2';
import CustomCalendar from '../../components/custom-calendar/CustomCalendar';
import { getUserDiaryStreak } from '../../apis/user-streak';
import { TUserDiaryStreak } from '../../apis/user-streak.types';
import ActionButton from '../../components/action-button/ActionButton';
import { useFocusEffect } from '@react-navigation/native';
import { StreakContainer, Container } from './HomePage.style';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQuery
import palette from '../../assets/styles/theme';

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

const streakQueryKey = ['userStreak']; //쿼리를 식별하는 고유한 키

const Home: React.FC<any> = ({ navigation }) => {
  const [carousels, setCarousels] = useState<TCarousel[]>(defaultHomeCarousel);
  //const [currentStreak, setCurrentStreak] = useState<number>(0); //현재 연속 기록 일수
  //const [maxStreak, setMaxStreak] = useState<number>(0); //최장 연속 기록 일수
  const isInitialSreakLoad = useRef<boolean>(true); //초기 로드 확인용
  const [playStreakLottieTrigger, setPlayStreakLottieTrigger] = useState<number>(0); //lottie 애니메이션 재생 트리거
  const previousCurrentStreakRef = useRef<number | undefined>(); // To track previous streak for animation
  const insets = useSafeAreaInsets();
  const { riskScoreV2, riskStatusV2, setRiskScoreV2, setRiskStatusV2, setHandleDangerPressV2 } =
    useRiskStoreVer2();

  const width = Dimensions.get('window').width - 40;
  const rsHeight = 1; // 비율 계산 예시
  const ratio = 1; // 비율 계산 예시

  //캐러셀 추가 (페이지네이션)
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const queryClient = useQueryClient(); // Get query client instance

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const {
    data: streakData, //API로부터 성공적으로 받아온 데이터
    isLoading: isLoadingStreak, // 데이터 로딩 중인지 여부
    error: streakError, // 데이터 로딩 중 에러 발생 시 에러 객체
    refetch: refetchStreakData, //데이터를 수동으로 다시 가져오는 함수
  } = useQuery<TUserDiaryStreak | undefined, Error>({
    //데이터 타입과 에러
    queryKey: streakQueryKey, //쿼리 키
    queryFn: getUserDiaryStreak, //데이터를 가지고 올 비동기 함수
    // staleTime: 1000 * 60 * 5, // 데이터가 'stale' 상태로 간주되기까지의 시간
    // refetchOnWindowFocus: true, // 창이 포커스될 떄마다 데이터를 다시 가져올 지 여부 (기본값 : true)
  });

  //streackData에서 실제 값을 추출 (데이터가 없거나 로딩 중일 때는 기본값 사용)
  const currentStreak = streakData?.currentStreak ?? 0;
  const maxStreak = streakData?.maxStreak ?? 0;

  //위험 상태에 따른 클릭 이벤트 처리 (쿠키 편지로 이동)
  const navigateToDangerAlert = () => {
    setHandleDangerPressV2();
    navigation.navigate(RootStackName.DangerStackNavigator, {
      screen: DangerStackName.DangerAlert,
      params: { letterIndex: getRiskData()?.letterIndex ?? 0 },
    });
  };

  useEffect(() => {
    console.log('홈 화면 로드됨. 애널리틱스 이벤트 기록 및 캐러셀 데이터 요청.');
    Analytics.watchTabHomeScreen();
    requestNotificationPermission();
    getCarousel('home')
      .then((res) => {
        if (!res || res.length === 0) return;
        setCarousels(res);
      })
      .catch((error: any) => {
        //console.error('[ERROR] homeCarousel: ', error);
      });
  }, []);

  //로티 애니메이션 트리거 로직 변경
  useEffect(() => {
    if (streakData?.currentStreak !== undefined) {
      //streakData가 로드되었는지 확인
      const newCurrent = streakData.currentStreak;
      const prevCurrent = previousCurrentStreakRef.current;

      // Log for debugging animation trigger
      //console.log(`스트릭 데이터 업데이트됨. 이전 값: ${prevCurrent}, 새 값: ${newCurrent}`);

      if (prevCurrent === undefined && newCurrent > 0) {
        // 초기 로드이고, 스트릭이 0보다 클 때, 애니메이션 실행
        //console.log(`Initial load animation trigger: ${newCurrent}`);
        setPlayStreakLottieTrigger((prev) => prev + 1);
      } else if (prevCurrent !== undefined && newCurrent > prevCurrent) {
        // 이전값보다 현재 서버에서 가져온 값이 더 클 때 애니메이션 실행
        //console.log(`Streak increased animation trigger: from ${prevCurrent} to ${newCurrent}`);
        setPlayStreakLottieTrigger((prev) => prev + 1);
      }
      //현재 currentStreack 값을 ref에 저장
      previousCurrentStreakRef.current = newCurrent; // Update ref for next comparison
    }
  }, [streakData]); // streakData가 변경될 때마다 useEffect 실행

  useFocusEffect(
    useCallback(() => {
      //console.log('홈 화면 포커스됨. 애널리틱스 및 스트릭 데이터 리페칭.');
      //Analytics.watchTabHomeScreen(); // Also watch tab on focus (if behavior is per-focus)

      //화면이 포커스될 때 스트릭 데이터를 무효화하여 다시 가져오도록 함
      refetchStreakData();
      return () => {
        // console.log('Home screen focus lost.');
        //console.log('홈 화면 포커스 해제됨.');
      };
    }, [queryClient, refetchStreakData]),
  );

  if (isLoadingStreak && !streakData) {
    // Show a loader only on initial load if desired
    // Optional: return a loading indicator
    // return <View><Text>Loading streaks...</Text></View>;
  }

  if (streakError) {
    // Optional: handle error display
    //console.error('Failed to load streak data:', streakError.message);
    // return <View><Text>Error loading streaks.</Text></View>;
  }

  return (
    <Container insets={insets}>
      {/* 스크롤 영역 */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={css`
            padding-horizontal: ${rsWidth * 20 + 'px'};
            padding-bottom: ${rsWidth * 20 + 'px'};
            flex: 1;
            gap: ${rsHeight * 15 + 'px'}; //gap 20 -> 15
            padding-bottom: ${rsHeight * 65 + 'px'}; //행복 버튼 패딩 추가
            //background-color: blue;
          `}>
          <Header
            riskStatus={riskStatusV2}
            onIconPress={() => {
              switch (riskStatusV2) {
                case 'safe':
                  //Analytics.clickClinicInfoButton(riskScoreV2);
                  WebBrowser.openBrowserAsync(
                    'https://autumn-flier-d18.notion.site/1268e75d989680f7b4f2d63d66f4a08a?pvs=4',
                  );
                  return;
                case 'danger':
                  //Analytics.clickDangerLetterButton(riskScoreV2);
                  break;
                case 'danger-opened':
                  //Analytics.clickOpenedDangerLetterButton(riskScoreV2);
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
                    //Analytics.clickTabHomeCarousel(item.image);
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
          <StreakContainer>
            <StreakCard
              icon="fire"
              value={currentStreak}
              label="연속 일기 기록수"
              lottieTrigger={playStreakLottieTrigger}
            />
            <StreakCard icon="twinkle-cookie" value={maxStreak} label="최장 일기 기록수" />
          </StreakContainer>

          {/* 캘린더 */}
          <CustomCalendar navigation={navigation} />
        </View>
      </ScrollView>
      {/* 행복 버튼 */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 15,
          //left: 20,
          //right: 20,
          backgroundColor: `${palette.neutral[50]}`,
          borderRadius: 20,
          width: 'auto',
          height: rsHeight * 40,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
            android: {
              elevation: 5,
            },
          }),
        }}>
        <ActionButton
          onPress={() => {
            navigation.navigate(RootStackName.HomeStackNavigator, {
              screen: HomeStackName.Quote,
            });
            Analytics.clickTabHomeHappyLyricsButton();
          }}></ActionButton>
      </View>
    </Container>
  );
};

export default Home;
