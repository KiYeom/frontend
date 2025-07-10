//채팅에서 사용하는 AdmobBanner
//import { BannerAd, BannerAdSize, TestIds }, mobileAds from 'react-native-google-mobile-ads';
import mobileAds, { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

const appVariant = Constants.expoConfig?.extra?.appVariant;
const isProductionOrStaging = appVariant === 'production' || appVariant === 'development';
const adUnitId = isProductionOrStaging
  ? Platform.OS === 'android'
    ? process.env.EXPO_PUBLIC_CHATTING_BANNER_AD_UNIT_ID_ANDROID
    : process.env.EXPO_PUBLIC_CHATTING_BANNER_AD_UNIT_ID_IOS
  : TestIds.BANNER;

const AdMobBanner = () => {
  const insets = useSafeAreaInsets();
  const [sdkReady, setSdkReady] = useState(false);
  console.log('AdMobBanner ', adUnitId);
  useEffect(() => {
    console.log('AdMobBanner adUnitId:', adUnitId);

    mobileAds()
      .setRequestConfiguration({
        testDeviceIdentifiers: ['6FE50E1C-9140-4519-B46A-68F69D4C2FD8'],
      })
      .then(() => {
        console.log('🔧 Request configuration set');
        return mobileAds().initialize();
      })
      .then((adapterStatuses) => {
        console.log('✅ AdMob SDK 초기화 성공:', adapterStatuses);
      })
      .catch((error) => {
        console.log('❌ AdMob SDK 초기화 실패:', error);
      });
  }, []);

  return (
    <View
      style={{
        width: '100%',
        height: 70, // 최소 높이 확보
        marginTop: insets.top,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)', // 배경 추가로 위치 확인
      }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        onAdLoaded={() => console.log('✅ 배너 로드 완료')}
        onAdFailedToLoad={(error) => {
          console.log('❌ 로드 실패:', {
            code: error.code,
            message: error.message,
            cause: error.cause,
          });
        }}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
};
export default AdMobBanner;
