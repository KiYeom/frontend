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
import { Annotation, TitleContainer, TitleTextContainter, Title, Container } from './qutoe.style';
import { getUserCanOpenQuote, updateUserCanOpenQuote } from '../../../apis/positive-quote';
import Button from '../../../components/button/button';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
const appVariant = Constants.expoConfig?.extra?.appVariant;
const isProductionOrStaging = appVariant === 'production' || appVariant === 'staging';
const userName = getUserNickname() ?? 'Test_remind_empty';
const isTestUser = userName === 'Test_remind';
const adUnitId =
  isProductionOrStaging && !isTestUser
    ? Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_ANDROID
      : process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_IOS
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
  const [image, setImage] = React.useState<string | null>(null);

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

  useEffect(() => {
    getUserCanOpenQuote().then((response) => {
      if (response && response.result) {
        console.log('오늘 열어본 적 없음');
        setUiMode('beforeOpenCookie');
      } else if (response && !response.result) {
        console.log('오늘 열어본 적 있음');
        setUiMode('showCookieResult'); //이미 까봤음
      } else {
        console.log('문제가 발생함');
        setUiMode('beforeOpenCookie');
      }
    });
  }, []);

  rewarded.load();
  console.log('uiMode', uiMode);

  //사진 저장 함수
  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
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
    return (
      <Container insets={insets}>
        <View style={{ flex: 1 }} ref={imageRef} collapsable={false}>
          <Text>너는 행운아입니다</Text>
          <Image
            source={require('../../../assets/images/blue_bubble.png')}
            style={{ width: 200, height: 200 }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 20,
            paddingHorizontal: 24,
            paddingBottom: insets.bottom,
          }}>
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
        </View>
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
    </Container>
  );
};
export default Quote;
