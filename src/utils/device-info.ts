import * as Device from 'expo-device';
import * as Application from 'expo-application';

const getIDFVWithTimeout = async (
  timeout: number = 500,
  maxRetries: number = 4,
): Promise<string | undefined> => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const value = await Promise.race([
        Application.getIosIdForVendorAsync(),
        new Promise<string>((_, reject) => setTimeout(() => reject(new Error()), timeout)),
      ]);

      if (!value || value === 'nil') {
        // 값이 비어있거나 nil이면 재시도하기
        throw new Error();
      }

      return value; // 성공적으로 값을 얻으면 반환
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed: Timeout`);
      attempt++;
    }
  }
  return undefined;
};

export const getDeviceId = async (): Promise<string | undefined> => {
  if (Device.osName === 'iOS' || Device.osName === 'iPadOS') {
    const deviceId = await getIDFVWithTimeout();
    return deviceId;
  } else if (Device.osName === 'Android') {
    return Application.getAndroidId();
  } else {
    return undefined;
  }
};

export const getDeviceOS = (): string => {
  return '' + Device.osName + Device.osVersion;
};

export const getAppVersion = (): string | null => {
  return Application.nativeApplicationVersion ?? 'unknown';
};
