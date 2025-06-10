import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rsWidth } from '../../../utils/responsive-size';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PhotoCardSize } from '../../../constants/Constants';
import palette from '../../../assets/styles/theme';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
  InterstitialAd,
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd, //보상형 전면 광고 클래스 추가
} from 'react-native-google-mobile-ads';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  getUserNickname,
  getPhotoCardLyric,
  getPhotoCardImage,
  savePhotoCardData,
} from '../../../utils/storageUtils';
import Constants from 'expo-constants';
import {
  Annotation,
  TitleContainer,
  TitleTextContainter,
  Title,
  Container,
  ButtonGroup,
  ImageContainer,
  AnimationContainer,
} from './qutoe.style';
import { getUserCanOpenQuote, updateUserCanOpenQuote } from '../../../apis/positive-quote';
import Button from '../../../components/button/button';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { happyLyrics, happyLyricsObject } from '../../../constants/Constants';
import PhotoCard from '../../../components/photo-card/photo-card';
import * as Haptics from 'expo-haptics';
import Analytics from '../../../utils/analytics';

const backgroundImages = [
  {
    id: 'bg1',
    source: require('../../../assets/images/lucky_image_1.png'),
    textPosition: { top: 53 }, // 기본 위치
  },
  {
    id: 'bg2',
    source: require('../../../assets/images/lucky_image_2.png'),
    textPosition: { top: 297 }, // 기본 위치
  },
  {
    id: 'bg3',
    source: require('../../../assets/images/lucky_image_3.png'),
    textPosition: { top: 53 }, // 기본 위치
  },
  {
    id: 'bg4',
    source: require('../../../assets/images/lucky_image_4.png'),
    textPosition: { top: 53 }, // 기본 위치
  },
  {
    id: 'bg5',
    source: require('../../../assets/images/lucky_image_5.png'),
    textPosition: { top: 33 }, // 기본 위치
  },
];
const appVariant = Constants.expoConfig?.extra?.appVariant;
const isProductionOrStaging = appVariant === 'production' || appVariant === 'staging';
const userName = getUserNickname() ?? 'Test_remind_empty';
const isTestUser = userName === 'Test_remind';
const adUnitId =
  isProductionOrStaging && !isTestUser
    ? Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_QUOTE_REWARDED_INTERSTITIAL_AD_UNIT_ID_ANDROID
      : process.env.EXPO_PUBLIC_QUOTE_REWARDED_INTERSTITIAL_AD_UNIT_ID_IOS
    : TestIds.REWARDED_INTERSTITIAL;
console.log('adUnitId', adUnitId);
console.log('test?', adUnitId === TestIds.REWARDED_INTERSTITIAL);
const Quote: React.FC = () => {
  //console.log('adUnitId in quote', adUnitId === TestIds.REWARDED);
  //console.log('appVariant in quote', appVariant);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const animation = useRef<LottieView>(null);

  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [uiMode, setUiMode] = React.useState<'beforeOpenCookie' | 'showCookieResult' | 'loading'>(
    'loading',
  );
  const [status, requestPermission] = MediaLibrary.usePermissions(); //사진 권한
  const imageRef = useRef<View>(null);
  const [selectedLyricObject, setSelectedLyricObject] = React.useState<happyLyricsObject | null>(
    null,
  );
  const [selectedImageSource, setSelectedImageSource] = React.useState<any | null>(null);
  if (status === null) {
    requestPermission();
  } else {
    //console.log('사진 권한 상태', status);
  }

  const rewardedInterstitial = useMemo(
    () =>
      RewardedInterstitialAd.createForAdRequest(adUnitId, {
        keywords: ['fashion', 'clothing'],
      }),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      Analytics.startHappyLyricsAdLoad();
      const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          //console.log('광고 로드 성공');
          Analytics.successHappyLyricsAdLoad(); // 애널리틱스 추가
          setLoaded(true);
        },
      );
      //광고를 끝까지 봐서 보상을 줄 수 있을 때 일기와 사진을 등록할 수 있는 콜백 함수를 unsubscribeEarned 이라는 이름으로 등록해둔다
      const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        async () => {
          Analytics.earnHappyLyricsAdReward(); // 애널리틱스 추가
          setUiMode('loading');
          //console.log('User earned reward of ');
          //api 호출하여 오늘 열어봤음을 업데이트 하기

          //랜덤 가사 객체 선택
          const lyricIndex = Math.floor(Math.random() * happyLyrics.length);
          setSelectedLyricObject(happyLyrics[lyricIndex]);
          //console.log('랜덤 가사 객체 선택 완료', lyricIndex);

          //랜덤 이미지 선택
          const imageIndex = Math.floor(Math.random() * backgroundImages.length);
          //console.log('======imageIndex', imageIndex);
          setSelectedImageSource(backgroundImages[imageIndex]);
          //console.log('랜덤 이미지 선택 완료', imageIndex);
          /// ==== ///

          // 선택한 데이터 mmkv에 저장
          savePhotoCardData(happyLyrics[lyricIndex], backgroundImages[imageIndex]);
          await updateUserCanOpenQuote();
          //setUiMode('showCookieResult'); //state를 변경하기 (uiMode를 showCookieResult로 변경하기)
        },
      );
      //광고가 닫힐 때 실행되는 이벤트 리스터
      const unsubscribeClosed = rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
        //console.log('광고 종료');
        Analytics.closeHappyLyricsAd(); // 애널리틱스 추가

        // After 3 seconds, change to result
        setTimeout(() => {
          setUiMode('showCookieResult');
          Analytics.watchHappyLyricsImageScreen();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft); // 광고 시청 후 진동 알림
        }, 1500);
      });
      // 광고 로드 실패 감지
      const unsubscribeFailedToLoad = rewardedInterstitial.addAdEventListener(
        AdEventType.ERROR,
        (error) => {
          Alert.alert('광고를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
          console.log('광고 로드 실패:', error);
          Analytics.failHappyLyricsAdLoad(error.message || 'Unknown error'); // 애널리틱스 추가
          setLoaded(false);
        },
      );
      //광고 로드
      rewardedInterstitial.load();
      // 컴포넌트 언마운트 시 이벤트 리스너 해제
      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeFailedToLoad();
        //console.log(`리스너 해제됨 : 현재 ${listenerCount}번 등록됨`);
      };
    }, [rewardedInterstitial]),
  );

  // 컴포넌트 초기화 시 저장된 데이터 확인
  useEffect(() => {
    const initializeQuote = async () => {
      // API를 통해 오늘 열어본 적이 있는지 확인
      const response = await getUserCanOpenQuote();

      if (response && response.result) {
        //console.log('오늘 열어본 적 없음');
        setUiMode('beforeOpenCookie');
        Analytics.watchBeforeOpenHappyLyricsImageScreen();
      } else if (response && !response.result) {
        //console.log('오늘 열어본 적 있음');

        // 저장된 데이터 로드
        const savedLyric = getPhotoCardLyric();
        const savedImage = getPhotoCardImage(backgroundImages);

        if (savedLyric && savedImage) {
          // 저장된 데이터가 있으면 상태 업데이트 후 결과 화면으로 이동
          setSelectedLyricObject(savedLyric);
          setSelectedImageSource(savedImage);
          setUiMode('showCookieResult');
          Analytics.watchHappyLyricsImageScreen();
        } else {
          // 저장된 데이터가 없다면 새로운 데이터 생성 필요
          // 랜덤 가사 & 이미지 선택
          const lyricIndex = Math.floor(Math.random() * happyLyrics.length);
          const imageIndex = Math.floor(Math.random() * backgroundImages.length);

          setSelectedLyricObject(happyLyrics[lyricIndex]);
          setSelectedImageSource(backgroundImages[imageIndex]);

          // 선택한 데이터 저장
          savePhotoCardData(happyLyrics[lyricIndex], backgroundImages[imageIndex]);

          setUiMode('showCookieResult');
          Analytics.watchHappyLyricsImageScreen();
        }
      } else {
        //console.log('문제가 발생함');
        setUiMode('beforeOpenCookie');
        Analytics.watchBeforeOpenHappyLyricsImageScreen();
      }
    };

    initializeQuote();
  }, []);

  rewardedInterstitial.load();
  //console.log('uiMode', uiMode);

  //랜덤 값 뽑기

  //사진 저장 함수
  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 472,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        Alert.alert(
          '저장 완료🎉', // 1. 짧고 굵은 제목
          '사진이 갤러리에 저장되었습니다', // 메시지
        );
      }
    } catch (e) {
      //console.log(e);
    }
  };

  //사진 공유
  const onShareImageAsync = async () => {
    const isSharingAvailable = await Sharing.isAvailableAsync();
    //console.log('isSharingAvailable', isSharingAvailable);
    if (!isSharingAvailable) {
      alert('이 기기에서는 공유 기능을 사용할 수 없습니다.');
      //console.log('Sharing API is not available on this device.');
      return; // 공유 기능 사용 불가 시 함수 종료
    }
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });
      const options = {
        dialogTitle: `'리마인드 - AI 강아지와 함께하는 힐링채팅, 감정일기'에서 오늘의 행복을 확인해보세요!`,
      };
      await Sharing.shareAsync(localUri, options);
    } catch (error) {
      //console.error('Error sharing image:', error);
      alert('Please select an image first.');
    }
  };

  const opacity = useSharedValue(0.7);
  const lottieRef = useRef(null);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      flex: 1,
      width: '100%',
    };
  });

  useEffect(() => {
    if (uiMode === 'showCookieResult') {
      // 화면이 밝아지는 애니메이션
      opacity.value = withDelay(
        300,
        withTiming(1, { duration: 1500, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
      );

      // Confetti 애니메이션 시작
      setTimeout(() => {
        if (lottieRef.current) {
          lottieRef.current.play();
        }
      }, 300);
    }
  }, [uiMode]); // uiMode가 변경될 때만 실행
  //오늘 열어본 적이 있다면
  if (uiMode === 'showCookieResult') {
    //console.log('selectdImageSource', selectedImageSource);
    return (
      <View style={{ backgroundColor: `${palette.neutral[50]}`, flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: `${palette.neutral[50]}`,
            gap: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'relative',
          }}
          showsVerticalScrollIndicator={false}>
          <Animated.View style={animatedStyle}>
            <LottieView
              autoPlay
              source={require('../../../assets/motion/new-confetti.json')}
              loop={false}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 1,
              }}
            />
            <TitleContainer>
              <TitleTextContainter>
                <Annotation>{userName}님을 위한</Annotation>
                <Title>오늘의 행복 한 조각</Title>
              </TitleTextContainter>
            </TitleContainer>
            <ImageContainer>
              <View
                ref={imageRef}
                collapsable={false}
                style={{
                  //backgroundColor: 'black',
                  width: PhotoCardSize.width,
                  height: PhotoCardSize.height,
                }}>
                {selectedLyricObject && (
                  <PhotoCard
                    lyricObject={selectedLyricObject}
                    backgroundImage={selectedImageSource}
                  />
                )}
              </View>
            </ImageContainer>
          </Animated.View>
        </ScrollView>
        <ButtonGroup insets={insets}>
          <Button
            title="저장하기"
            onPress={() => {
              //console.log('저장히기 버튼 클릭');
              Analytics.clickHappyLyricsImageSaveButton();
              onSaveImageAsync();
              //navigation.navigate('Home');
            }}
            primary={false}
          />
          <Button
            title="공유하기"
            onPress={async () => {
              //console.log('공유하기 버튼 클릭');
              onShareImageAsync();
              Analytics.clickHappyLyricsImageShareButton();
            }}
            primary={true}
          />
        </ButtonGroup>
      </View>
    );
  }

  if (uiMode === 'loading') {
    return (
      <Container insets={insets}>
        <AnimationContainer style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {selectedImageSource && (
            <Image
              source={selectedImageSource.source}
              style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }}
              //onLoad={() => console.log('로딩 화면에서 이미지 미리 로드 완료')}
            />
          )}

          {/* PhotoCard 컴포넌트의 숨겨진 버전을 미리 로드 */}
          {selectedLyricObject && selectedImageSource && (
            <View style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }}>
              <PhotoCard lyricObject={selectedLyricObject} backgroundImage={selectedImageSource} />
            </View>
          )}
          <LottieView
            autoPlay
            source={require('../../../assets/motion/loading.json')}
            loop={false}
            speed={1.0}
            onAnimationFinish={() => {
              //console.log('로딩 애니메이션 완료');
              // 애니메이션이 끝나면 showCookieResult로 전환 (백업 메커니즘)
              setUiMode('showCookieResult');
            }}
            style={{
              width: '150',
              height: '150',
              position: 'absolute',
            }}
          />
        </AnimationContainer>
      </Container>
    );
  }

  return (
    //오늘 열어본 적이 없다면
    <Container insets={insets}>
      <TitleContainer>
        <TitleTextContainter>
          <Annotation>세잎클로버를 터치해보세요!</Annotation>
          <Title>{`오늘은 어떤 행복이\n기다리고 있을까요?`}</Title>
        </TitleTextContainter>
      </TitleContainer>
      <AnimationContainer>
        <TouchableOpacity
          onPress={async () => {
            Analytics.clickHappyLyricsAdShow(); // 애널리틱스 추가
            //console.log('Animation clicked!');
            if (loaded) {
              try {
                Analytics.successHappyLyricsAdShow(); // 애널리틱스 추가
                await rewardedInterstitial.show();
              } catch (error) {
                console.log('광고 표시 실패:', error);
                Analytics.failHappyLyricsAdShow(error.message || 'Unknown error'); // 애널리틱스 추가
                Alert.alert('광고를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
                rewardedInterstitial.load();
              }
            } else {
              console.log('광고가 아직 로드되지 않았습니다.');
              Alert.alert('광고를 준비 중입니다. 잠시 후 다시 시도해주세요.');
              rewardedInterstitial.load();
            }
          }}>
          <LottieView
            autoPlay
            ref={animation}
            source={require('../../../assets/motion/three-clover.json')}
            loop
            style={{
              width: '100%',
              height: '100%',
              //backgroundColor: '#eee',
            }}
          />
        </TouchableOpacity>
      </AnimationContainer>
    </Container>
  );
};
export default Quote;
