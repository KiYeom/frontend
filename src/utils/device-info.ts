import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const getDeviceId = async (): Promise<string | null> => {
  if (Platform.OS === 'ios') {
    return await Application.getIosIdForVendorAsync();
  } else if (Platform.OS === 'android') {
    return Application.getAndroidId();
  } else {
    return null;
  }
};

export const getDeviceOS = (): string => {
  return '' + Device.osName + Device.osVersion;
};

//현재 사용자가 사용하는 앱의 버전을 가지고 옴
export const getAppVersion = (): string | null => {
  return Application.nativeApplicationVersion ?? 'unknown';
};
