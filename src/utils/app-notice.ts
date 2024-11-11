import { Alert, AlertButton } from 'react-native';
import { TNotice } from '../constants/types';
import * as WebBrowser from 'expo-web-browser';
import Analytics from './analytics';

export const showAppNotice = (notice: TNotice): void => {
  const isForceNotice = notice.force ?? false;
  const alertButtons: AlertButton[] = [];
  for (let i = 0; i < notice.buttons.length; i++) {
    const button = notice.buttons[i];
    alertButtons.push({
      text: button.text,
      onPress: async () => {
        Analytics.clickAppNoticeButton(button.link);
        await WebBrowser.openBrowserAsync(button.link);
        if (isForceNotice) {
          showAppNotice(notice);
        }
      },
      style: 'default',
    });
  }
  if (!isForceNotice) {
    alertButtons.push({
      text: '닫기',
      onPress: () => {
        Analytics.clickAppNoticeButton('close');
      },
      style: 'cancel',
    });
  }
  Alert.alert(notice.title, notice.content, alertButtons);
};
