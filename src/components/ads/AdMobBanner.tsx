//AdmobBanner
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const AdMobBanner = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        //paddingTop: insets.top, // Adjust padding to avoid overlap with status bar
      }}>
      <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.BANNER} />
    </View>
  );
};
export default AdMobBanner;
