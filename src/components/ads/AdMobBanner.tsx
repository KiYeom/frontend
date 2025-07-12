//채팅에서 사용하는 AdmobBanner
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const appVariant = Constants.expoConfig?.extra?.appVariant;
const isProductionOrStaging = appVariant === 'production' || appVariant === 'development';
const adUnitId = isProductionOrStaging
  ? Platform.OS === 'android'
    ? process.env.EXPO_PUBLIC_CHATTING_BANNER_AD_UNIT_ID_ANDROID
    : process.env.EXPO_PUBLIC_CHATTING_BANNER_AD_UNIT_ID_IOS
  : TestIds.BANNER;

const AdMobBanner = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 101,
        //paddingTop: insets.top, // Adjust padding to avoid overlap with status bar
      }}>
      <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />
    </View>
  );
};
export default AdMobBanner;
