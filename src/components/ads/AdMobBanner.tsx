//채팅에서 사용하는 AdmobBanner
//import { BannerAd, BannerAdSize, TestIds }, mobileAds from 'react-native-google-mobile-ads';
import mobileAds, { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';

const appVariant = Constants.expoConfig?.extra?.appVariant;
const isProductionOrStaging = appVariant === 'production' || appVariant === 'development';
const adUnitId = isProductionOrStaging
  ? Platform.OS === 'android'
    ? process.env.EXPO_PUBLIC_CHATTING_BANNER_AD_UNIT_ID_ANDROID
    : process.env.EXPO_PUBLIC_CHATTING_BANNER_AD_UNIT_ID_IOS
  : TestIds.BANNER;

const AdMobBanner = () => {
  const insets = useSafeAreaInsets();
  const [isAdLoaded, setIsAdLoaded] = useState<boolean>(false);

  const handleAdLoaded = () => {
    setIsAdLoaded(true);
  };

  const handleAdFailedToLoad = (error) => {
    setIsAdLoaded(false);
    // Sentry에 광고 로드 실패 에러 전송
    Sentry.captureException(new Error('AdMob banner load failed'), {
      level: 'warning',
      extra: {
        errorCode: error.code,
        errorMessage: error.message,
        errorCause: error.cause,
        adUnitId: adUnitId,
        platform: Platform.OS,
        appVariant,
        isProduction: isProductionOrStaging,
      },
      tags: {
        component: 'AdMobBanner',
        errorType: 'ad_load_failed',
      },
    });
  };

  return (
    <View
      style={{
        width: '100%',
        // 광고가 로드되지 않으면 높이를 줄임 (완전히 0으로 하면 광고가 로드되지 않을 수 있음)
        height: isAdLoaded ? 70 : 1,
        marginTop: insets.top,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isAdLoaded ? 'rgba(255,255,255,1)' : 'transparent',
        zIndex: 1000,
        overflow: 'hidden',
      }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdLoaded={handleAdLoaded}
        // 테스트를 위한 추가 props
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default AdMobBanner;
