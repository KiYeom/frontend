import React from 'react';
import { Keyboard } from 'react-native';
import Button from '../../../../button/button';
import DeactivateReasonCheckBoxs from '../../../../molecules/DeactivateReasonCheckBoxs';
import { Alert } from 'react-native';
import { clearInfoWhenLogout, getUserNickname } from '../../../../../utils/storageUtils';
import { CheckboxContainer } from './DeactivateReason.style';
import { useState } from 'react';
import { FormContainer } from './DeactivateReason.style';
import { reasons } from '../../../../../constants/Constants';
import { useEffect } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import {
  Container,
  SignOutTitle,
  SignOutTitleContainer,
} from '../dedactivate-alert/DeactivateAlert.style';
import { deavtivate } from '../../../../../apis/setting';
import { UseSigninStatus } from '../../../../../utils/signin-status';

const DeactivateReason: React.FC = () => {
  const [btnDisable, setBtnDisable] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean[]>(Array(reasons.length).fill(false));
  const [text, setText] = useState<string>('');
  const { setSigninStatus } = UseSigninStatus();

  const deactiveUser = () => {
    setBtnDisable(true);
    const reasons = saveReason();
    deavtivate(reasons)
      .then((res) => {
        if (res.result) {
          clearInfoWhenLogout();
          setSigninStatus(false);
        }
      })
      .catch((e) => {
        alert('회원 탈퇴가 실패했습니다. 잠시 후 다시 시도해주세요.\n 문의: admin@remind4u.co.kr');
      });
    setBtnDisable(false);
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
    console.log('text', text);
  }, [isChecked, text]); // 의존성 배열에 etcText 추가

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
    //console.log('Selected reasons:', selectedReasons);
    //console.log('selected...', JSON.stringify(selectedReasons));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <Button
            title="탈퇴하기"
            disabled={btnDisable}
            primary={true}
            onPress={() => {
              Alert.alert(
                '정말 탈퇴하시겠어요?', // 첫번째 text: 타이틀 큰 제목
                '탈퇴 버튼 선택 시, 계정은 삭제되며 복구되지 않습니다', // 두번째 text: 작은 제목
                [
                  { text: '취소', onPress: () => console.log('탈퇴 취소함') },
                  {
                    text: '탈퇴', // 버튼 제목
                    onPress: () => deactiveUser(),
                  },
                ],
                { cancelable: false }, //alert 밖에 눌렀을 때 alert 안 없어지도록
              );
              //deactivateRequest();
            }}
          />
        </FormContainer>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default DeactivateReason;
