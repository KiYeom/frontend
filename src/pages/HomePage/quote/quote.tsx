import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rsWidth } from '../../../utils/responsive-size';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { getUserNickname } from '../../../utils/storageUtils';
import Constants from 'expo-constants';
import {
  Annotation,
  TitleContainer,
  TitleTextContainter,
  Title,
  Container,
  ButtonGroup,
} from './qutoe.style';
import { getUserCanOpenQuote, updateUserCanOpenQuote } from '../../../apis/positive-quote';
import Button from '../../../components/button/button';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { happyLyrics, happyLyricsObject } from '../../../constants/Constants';
import PhotoCard from '../../../components/photo-card/photo-card';
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
      ? process.env.EXPO_PUBLIC_QUOTE_REWARD_AD_UNIT_ID_ANDROID
      : process.env.EXPO_PUBLIC_QUOTE_REWARD_AD_UNIT_ID_IOS
    : TestIds.REWARDED;

const Quote: React.FC = () => {
  console.log('adUnitId in quote', adUnitId === TestIds.REWARDED);
  console.log('appVariant in quote', appVariant);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const animation = useRef<LottieView>(null);

  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [uiMode, setUiMode] = React.useState<'beforeOpenCookie' | 'showCookieResult'>(
    'beforeOpenCookie',
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
    console.log('사진 권한 상태', status);
  }

  const rewarded = useMemo(
    () =>
      RewardedAd.createForAdRequest(adUnitId, {
        keywords: ['fashion', 'clothing'],
      }),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        //console.log('광고 로드');
        setLoaded(true);
      });
      //광고를 끝까지 봐서 보상을 줄 수 있을 때 일기와 사진을 등록할 수 있는 콜백 함수를 unsubscribeEarned 이라는 이름으로 등록해둔다
      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        async (reward) => {
          console.log('User earned reward of ', reward);
          //api 호출하여 오늘 열어봤음을 업데이트 하기

          //랜덤 가사 객체 선택
          const lyricIndex = Math.floor(Math.random() * happyLyrics.length);
          setSelectedLyricObject(happyLyrics[lyricIndex]);
          console.log('랜덤 가사 객체 선택 완료', lyricIndex);

          //랜덤 이미지 선택
          const imageIndex = Math.floor(Math.random() * backgroundImages.length);
          console.log('======imageIndex', imageIndex);
          setSelectedImageSource(backgroundImages[imageIndex]);
          console.log('랜덤 이미지 선택 완료', imageIndex);
          /// ==== ///
          await updateUserCanOpenQuote();
          setUiMode('showCookieResult'); //state를 변경하기 (uiMode를 showCookieResult로 변경하기)
        },
      );
      //광고가 닫힐 때 실행되는 이벤트 리스터
      const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('광고 종료');
      });
      //광고 로드
      rewarded.load();
      // 컴포넌트 언마운트 시 이벤트 리스너 해제
      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        //console.log(`리스너 해제됨 : 현재 ${listenerCount}번 등록됨`);
      };
    }, [rewarded]),
  );

  //쿠키를 까 봤는지를 확인
  /*
  useEffect(() => {
    getUserCanOpenQuote().then((response) => {
      if (response && response.result) {
        console.log('오늘 열어본 적 없음');
        setUiMode('beforeOpenCookie');
      } else if (response && !response.result) {
        console.log('오늘 열어본 적 있음');
        //setUiMode('showCookieResult'); //잠깐 주석 처리함
        setUiMode('beforeOpenCookie');
      } else {
        console.log('문제가 발생함');
        setUiMode('beforeOpenCookie');
      }
    });
  }, []);*/

  rewarded.load();
  console.log('uiMode', uiMode);

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
      console.log(e);
    }
  };

  //사진 공유
  const onShareImageAsync = async () => {
    const isSharingAvailable = await Sharing.isAvailableAsync();
    console.log('isSharingAvailable', isSharingAvailable);
    if (!isSharingAvailable) {
      alert('이 기기에서는 공유 기능을 사용할 수 없습니다.');
      console.log('Sharing API is not available on this device.');
      return; // 공유 기능 사용 불가 시 함수 종료
    }
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });
      await Sharing.shareAsync(localUri);
    } catch (error) {
      console.error('Error sharing image:', error);
      alert('Please select an image first.');
    }
  };

  //오늘 열어본 적이 있다면
  if (uiMode === 'showCookieResult') {
    console.log('selectdImageSource', selectedImageSource);
    return (
      <Container insets={insets}>
        <TitleContainer>
          <TitleTextContainter>
            <Annotation>{userName}님을 위한</Annotation>
            <Title>오늘의 행복 한 조각</Title>
          </TitleTextContainter>
        </TitleContainer>
        <View>
          <View ref={imageRef} collapsable={false}>
            {selectedLyricObject && (
              <PhotoCard lyricObject={selectedLyricObject} backgroundImage={selectedImageSource} />
            )}
          </View>
        </View>

        <ButtonGroup insets={insets}>
          <Button
            title="저장하기"
            onPress={() => {
              console.log('저장히기 버튼 클릭');
              onSaveImageAsync();
              //navigation.navigate('Home');
            }}
            primary={false}
          />
          <Button
            title="공유하기"
            onPress={async () => {
              console.log('공유하기 버튼 클릭');
              onShareImageAsync();
            }}
            primary={true}
          />
        </ButtonGroup>
      </Container>
    );
  }

  /*
  // 0) 전역 비교용 변수 선언
  let maxLinesCount = 0;
  let maxLinesSong = null;

  let maxLineCharCount = 0;
  let maxLineCharSong = null;
  let maxLineCharText = '';

  let maxTitleLen = 0;
  let maxTitleSong = null;

  let maxSingerLen = 0;
  let maxSingerSong = null;
  let totalLines = 0;

  // 1) 기존 forEach에 비교 로직 추가
  happyLyrics.forEach(({ title, singer, lyric }) => {
    // --- 기존 계산 ---
    const titleLen = title.length;
    const singerLen = singer.length;
    const lines = lyric.split('\n').filter((line) => line.trim() !== '');
    const lineLens = lines.map((line) => line.length);

    totalLines += lines.length;

    // --- 1. 줄 수가 제일 많은 곡 ---
    if (lines.length > maxLinesCount) {
      maxLinesCount = lines.length;
      maxLinesSong = { title, singer, linesCount: lines.length };
    }

    // --- 2. 줄 중 글자 수가 제일 많은 한 줄을 가진 곡 ---
    lines.forEach((line) => {
      const len = line.length;
      if (len > maxLineCharCount) {
        maxLineCharCount = len;
        maxLineCharSong = { title, singer };
        maxLineCharText = line;
      }
    });

    // --- 3. 타이틀이 가장 긴 곡 ---
    if (titleLen > maxTitleLen) {
      maxTitleLen = titleLen;
      maxTitleSong = { title, singer, titleLen };
    }

    // --- 4. 가수 이름이 가장 긴 곡 ---
    if (singerLen > maxSingerLen) {
      maxSingerLen = singerLen;
      maxSingerSong = { title, singer, singerLen };
    }

    // --- (기존 콘솔 출력) ---
    console.log(
      `${title} : ${titleLen}자, ` +
        `${singer} : ${singerLen}자, ` +
        `lyric : ${lines.length}줄, ` +
        `(줄별 글자수 → ${lineLens.map((l) => l + '자').join(', ')})`,
    );
  });

  // 2) 반복이 끝난 뒤 한 번만 전체 결과 출력
  console.log('\n===== 전체 비교 결과 =====');
  console.log(
    `1) 줄 수가 가장 많은 곡: "${maxLinesSong.title}" by ${maxLinesSong.singer} → ${maxLinesSong.linesCount}줄`,
  );
  console.log(
    `2) 한 줄 글자 수가 가장 많은 곡: "${maxLineCharSong.title}" by ${maxLineCharSong.singer}`,
  );
  console.log(`   → 해당 줄 (${maxLineCharCount}자): "${maxLineCharText}"`);
  console.log(
    `3) 타이틀이 가장 긴 곡: "${maxTitleSong.title}" by ${maxTitleSong.singer} → ${maxTitleSong.titleLen}자`,
  );
  console.log(
    `4) 가수 이름이 가장 긴 곡: "${maxSingerSong.title}" by ${maxSingerSong.singer} → ${maxSingerSong.singerLen}자`,
  );
  const avgLines = totalLines / happyLyrics.length;
  console.log(`\n평균 줄 수: ${avgLines.toFixed(2)}줄`);
  console.log(`총 곡 개수: ${happyLyrics.length}개`);*/

  return (
    //오늘 열어본 적이 없다면
    <Container insets={insets}>
      <TitleContainer>
        <TitleTextContainter>
          <Annotation>세잎클로버를 터치해보세요!</Annotation>
          <Title>{`오늘은 어떤 행복이\n기다리고 있을까요?`}</Title>
        </TitleTextContainter>
      </TitleContainer>
      <View style={{ flex: 1, backgroundColor: 'pink' }}>
        <TouchableOpacity
          onPress={async () => {
            console.log('Animation clicked!');
            rewarded.load();
            await rewarded.show();
          }}>
          <LottieView
            autoPlay
            ref={animation}
            source={require('../../../assets/motion/three-clover.json')}
            loop
            style={{
              width: 200,
              height: 200,
              backgroundColor: '#eee',
            }}
          />
        </TouchableOpacity>
      </View>
    </Container>
  );
};
export default Quote;
