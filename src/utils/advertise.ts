import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { TestIds } from 'react-native-google-mobile-ads';
import { getUserNickname } from './storageUtils';

export const getAdUnitId = (): string => {
  const userName = getUserNickname() ?? 'Test_remind_empty';
  const appVariant = Constants.expoConfig?.extra?.appVariant;
  const isProductionOrStaging = appVariant === 'production' || appVariant === 'staging';
  const isTestUser = userName === 'Test_remind';

  if (isProductionOrStaging && !isTestUser) {
    return Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_ANDROID
      : process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_IOS;
  } else {
    return TestIds.REWARDED;
  }
};

const adUnitId = getAdUnitId();

export default adUnitId;
