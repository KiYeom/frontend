import * as Device from 'expo-device';
import * as Application from 'expo-application';

export const getDeviceId = async (): Promise<string | null> => {
  if (Device.osName === 'iOS' || Device.osName === 'iPadOS') {
    return await Application.getIosIdForVendorAsync();
  } else if (Device.osName === 'Android') {
    return Application.getAndroidId();
  } else {
    return null;
  }
};

export const getDeviceOS = (): string => {
  return '' + Device.osName + Device.osVersion;
};

export const getAppVersion = (): string | null => {
  return Application.nativeApplicationVersion ?? 'unknown';
};
