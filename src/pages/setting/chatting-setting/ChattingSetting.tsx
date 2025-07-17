import React, { useEffect } from 'react';
import { getNotificationStatus, setNotificationStatus } from '../../../apis/notification';
import Analytics from '../../../utils/analytics';
import SwitchRow from '../../../components/switch-row/SwitchRow';
import { ScrollContainer } from '../notifications/notifications.styles';
import { getUserInfo } from '../../../apis/setting';
import { switchChatTone } from '../../../apis/setting';
//설정 - 알림설정
const Chattingsetting = () => {
  //대화체를 관리하는 isCasualMode state
  const [isInFormalMode, setIsInformalMode] = React.useState(true);

  useEffect(() => {
    Analytics.watchChattingSettingScreen();
    getUserInfo() //반말 존댓말 정보 가져옴
      .then((res) => {
        if (res) {
          setIsInformalMode(res.isInFormal);
        } else {
          return;
        }
      })
      .catch((error) => {
        //console.log('catch');
      });
  }, []);

  return (
    <ScrollContainer>
      <SwitchRow
        title="쿠키 반말 모드"
        desc="반말 모드를 활성화 할 경우, 쿠키가 반말로 대답합니다."
        isEnabled={isInFormalMode}
        disabled={false}
        onPress={() => {
          Analytics.clickChattingSettingSwitch(!isInFormalMode);
          switchChatTone(!isInFormalMode);
          setIsInformalMode(!isInFormalMode);
        }}
      />
    </ScrollContainer>
  );
};
export default Chattingsetting;
