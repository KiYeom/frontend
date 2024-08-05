import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
import { USER } from '../constants/Constants';
import { instance } from '../apis/interceptor';
import { setNotificationToken } from '../apis/notification';

function handleRegistrationError(errorMessage: string) {
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
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

const requestPermission = async () => {
  const token = await registerForPushNotificationsAsync();
  //TODO: 권한 예외사항 처리
  if (!token || !USER.DEVICEID) {
    return;
  }
  setNotificationToken(token, USER.DEVICEID);
};
export default requestPermission;
