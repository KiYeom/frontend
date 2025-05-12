/*
quote 페이지 : 안전 영역만을 제거하고, 화면 가운데에 hellow world을 출력하는 페이지
*/
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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
import { Annotation, TitleContainer, TitleTextContainter, Title } from './qutoe.style';

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

  rewarded.load();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
    </View>
  );
};
export default Quote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
