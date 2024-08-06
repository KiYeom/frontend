import * as Device from 'expo-device';
import * as Application from 'expo-application';

export const getDeviceId = async (): Promise<string> => {
  if (Device.osName === 'iOS' || Device.osName === 'iPadOS') {
    const deviceId = await Application.getIosIdForVendorAsync();
    return deviceId || '';
  } else if (Device.osName === 'Android') {
    const deviceId = await Application.getAndroidId();
    return deviceId || '';
  } else {
    throw new Error('[ERROR] getDeviceId: Unsupported OS');
  }
};

export const getDeviceOS = (): string => {
  return '' + Device.osName + Device.osVersion;
};

export const getAppVersion = (): string | null => {
  return Application.nativeApplicationVersion;
};
