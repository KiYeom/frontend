import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

export const getDeviceId = async (): Promise<string | null> => {
  if (Platform.OS === 'ios') {
    return await Application.getIosIdForVendorAsync();
  } else if (Platform.OS === 'android') {
    return Application.getAndroidId();
  } else {
    console.log('Unsupported OS: ' + Platform.OS);
    return null;
  }
};

export const getDeviceOS = (): string => {
  return '' + Device.osName + Device.osVersion;
};

export const getAppVersion = (): string | null => {
  return Application.nativeApplicationVersion ?? 'unknown';
};
