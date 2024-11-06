import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { deactivate } from '../../../../../apis/setting';
import { reasons } from '../../../../../constants/Constants';
import Analytics from '../../../../../utils/analytics';
import { UseSigninStatus } from '../../../../../utils/signin-status';
import { clearInfoWhenLogout, getUserNickname } from '../../../../../utils/storageUtils';
import Button from '../../../../button/button';
import DeactivateReasonCheckBoxs from '../../../../molecules/DeactivateReasonCheckBoxs';
import { CheckboxContainer, FormContainer } from './DeactivateReason.style';
import {
  Container,
  SignOutTitle,
  SignOutTitleContainer,
} from '../deactivate-alert/DeactivateAlert.style';
import { css } from '@emotion/native';
import { rsHeight, rsWidth } from '../../../../../utils/responsive-size';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DeactivateReason: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [btnDisable, setBtnDisable] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean[]>(Array(reasons.length).fill(false));
  const [text, setText] = useState<string>('');

  const { setSigninStatus } = UseSigninStatus();

  const makeAlert = () => {
    Alert.alert(
      '정말 탈퇴하시겠어요?', // 첫번째 text: 타이틀 큰 제목
      '탈퇴 버튼 선택 시, 계정은 삭제되며 복구되지 않습니다', // 두번째 text: 작은 제목
      [
        {
          text: '취소',
          onPress: () => {
            Analytics.clickWithdrawalModalCancelButton();
          },
        },
        {
          text: '탈퇴', // 버튼 제목

          onPress: () => {
            Analytics.clickWithdrawalModalConfirmButton();
            deactiveUser();
          },
        },
      ],
      { cancelable: false }, //alert 밖에 눌렀을 때 alert 안 없어지도록
    );
  };

  const deactiveUser = () => {
    setBtnDisable(true);
    const reasons = saveReason();
    deactivate(reasons)
      .then((res) => {
        if (res.result) {
          clearInfoWhenLogout();
          setSigninStatus(false);
        }
      })
      .catch((e) => {
        alert('회원 탈퇴가 실패했습니다. 잠시 후 다시 시도해주세요.\n 문의: admin@remind4u.co.kr');
        setBtnDisable(false);
      });
  };

  // useEffect를 사용하여 isChecked 변화에 따라 버튼의 비활성화 상태 변경
  // 모두 체크가 안 되어있으면 btnDisable = true.
  // 기타를 체크했지만 기타(idx 3)에 글자가 안적혀있으면 btnDisable = true

  useEffect(() => {
    const allUnchecked = isChecked.every((checked) => !checked);
    const isEtcChecked = isChecked[3]; // "기타" 체크박스 상태
    const isEtcTextEmpty = text === '';

    // 조건: 모든 체크박스가 해제되었거나, "기타"가 선택되었지만 입력이 없을 경우 비활성화
    if (allUnchecked || (isEtcChecked && isEtcTextEmpty)) {
      setBtnDisable(true);
    } else {
      setBtnDisable(false);
    }
  }, [isChecked, text]); // 의존성 배열에 etcText 추가

  useEffect(() => {
    Analytics.watchWithdrawalReasonScreen();
  }, []);

  // 체크된 인덱스를 찾아 해당 이유를 추출
  const saveReason = (): string => {
    const selectedReasons = isChecked
      .map((checked, index) => {
        if (checked) {
          return index === 3 ? text : reasons[index];
        }
        return null;
      })
      .filter((reason) => reason !== null);
    return JSON.stringify(selectedReasons);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          marginBottom: insets.bottom,
        }}>
        <Container>
          <SignOutTitleContainer>
            <SignOutTitle status="default">
              {getUserNickname()}님,{'\n'}떠나시는 이유를 알려주세요
            </SignOutTitle>
          </SignOutTitleContainer>
          <FormContainer>
            <CheckboxContainer>
              <DeactivateReasonCheckBoxs
                isChecked={isChecked}
                setIsChecked={setIsChecked}
                text={text}
                setText={setText}
              />
            </CheckboxContainer>

            <View
              style={css`
                display: flex;
                justify-content: center;
                padding: 0 0 ${rsWidth * 24 + 'px'} 0;
                gap: ${rsHeight * 12 + 'px'};
              `}>
              <Button
                title="탈퇴하기"
                disabled={btnDisable}
                primary={true}
                onPress={() => {
                  Analytics.clickWithdrawalFinalButton();
                  makeAlert();
                }}
              />
            </View>
          </FormContainer>
        </Container>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DeactivateReason;
