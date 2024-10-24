import React, { useEffect } from 'react';
import { getNotificationStatus, setNotificationStatus } from '../../../../apis/notification';
import Analytics from '../../../../utils/analytics';
import SwitchRow from '../../../switch-row/switch-row';
import { ScrollContainer } from './notifications.styles';

const Notifications = () => {
  const [systemSwitchState, setSystemSwitchState] = React.useState(false);
  const [cookieSwitchState, setCookieSwitchState] = React.useState(false);
  const [systemLoading, setSystemLoading] = React.useState(true);
  const [cookieLoading, setCookieLoading] = React.useState(true);

  const setSystemNotification = async (isAllow: boolean) => {
    setSystemLoading(true);
    const res = await setNotificationStatus('system', isAllow);
    if (res) {
      setSystemSwitchState(isAllow);
      setSystemLoading(false);
    }
  };

  const setCookieNotification = async (isAllow: boolean) => {
    setCookieLoading(true);
    const res = await setNotificationStatus('chat_cookie', isAllow);
    if (res) {
      setCookieSwitchState(isAllow);
      setCookieLoading(false);
    }
  };

  useEffect(() => {
    Analytics.watchNotificationSettingScreen();
    getNotificationStatus()
      .then((res) => {
        if (res) {
          if (res.allowedNotifications.includes('system')) {
            setSystemSwitchState(true);
          }
          if (res.allowedNotifications.includes('chat_cookie')) {
            setCookieSwitchState(true);
          }
          setSystemLoading(false);
          setCookieLoading(false);
        } else {
          alert('알림 상태 가져올 수 없습니다. 잠시 후 다시 시도해주시기 바랍니다.');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('알림 상태 가져올 수 없습니다. 잠시 후 다시 시도해주시기 바랍니다.');
      });
  }, []);

  return (
    <ScrollContainer>
      <SwitchRow
        title="서비스 필수 알림"
        desc="업데이트 공지, 시스템 점검 등 서비스 제공과 관련된 알림을 드립니다. "
        isEnabled={systemSwitchState}
        disabled={systemLoading}
        onPress={() => {
          Analytics.clickNotificationSettingSwitch('system', !systemSwitchState);
          setSystemNotification(!systemSwitchState);
        }}
      />
      <SwitchRow
        title="쿠키 채팅 알림"
        desc="쿠기가 사용자에게 메시지를 보낼 때 알림을 드립니다. "
        isEnabled={cookieSwitchState}
        disabled={cookieLoading}
        onPress={() => {
          Analytics.clickNotificationSettingSwitch('cookie', !cookieSwitchState);
          setCookieNotification(!cookieSwitchState);
        }}
      />
    </ScrollContainer>
  );
};
export default Notifications;
