import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { setNotificationToken } from '../apis/notification';
import { getDeviceIdFromMMKV, getNotificationSent, setNotificationSent } from './storageUtils';

function handleRegistrationError(errorMessage: string) {
  console.log(errorMessage);
}

const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      // 권한이 없을 때
      // 권한 요청하기
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      //요청해도 없을 때
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
};

const requestNotificationPermission = async () => {
  const isSent = getNotificationSent();
  if (isSent && isSent === true) {
    return;
  }
  console.log('requestNotificationPermission 실행');
  const token = await registerForPushNotificationsAsync();
  const deviceId = getDeviceIdFromMMKV();
  //console.log('🔔 Notification token:', token, deviceId);
  if (token && deviceId) {
    const result = await setNotificationToken(token, deviceId);
    //console.log('🔔 Notification token set:', result);
    if (result) {
      console.log('setNotificationSent called');
      setNotificationSent(true);
    }
  }
};
export default requestNotificationPermission;
