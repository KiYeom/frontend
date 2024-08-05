import React from 'react';
import { Keyboard } from 'react-native';
import Button from '../../button/button';
import DeactivateReasonCheckBoxs from '../../molecules/DeactivateReasonCheckBoxs';
import { Alert } from 'react-native';
import { SignOutTitle, SignOutTitleContainer, Container } from './DeactivateAlert.style';
import { getUserNickname } from '../../../utils/storageUtils';
import { CheckboxContainer } from './DeactivateReason.style';
import { useState } from 'react';
import { FormContainer } from './DeactivateReason.style';
import { reasons } from '../../../constants/Constants';
import { useEffect } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
const DeactivateReason: React.FC = ({ route }) => {
  const { deactivateRequest } = route.params;
  const [btnDisable, setBtnDisable] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean[]>(Array(reasons.length).fill(false));
  const [text, setText] = useState<string>('');
  let deactivateInfo = '';

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
  const saveReason = () => {
    const selectedReasons = isChecked
      .map((checked, index) => {
        if (checked) {
          return index === 3 ? text : reasons[index];
        }
        return null;
      })
      .filter((reason) => reason !== null);
    deactivateInfo = JSON.stringify(selectedReasons);
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
              saveReason();
              console.log('탈퇴 버튼 누름');
              Alert.alert(
                '정말 탈퇴하시겠어요?', // 첫번째 text: 타이틀 큰 제목
                '탈퇴 버튼 선택 시, 계정은 삭제되며 복구되지 않습니다', // 두번째 text: 작은 제목
                [
                  { text: '취소', onPress: () => console.log('탈퇴 취소함') },
                  {
                    text: '탈퇴', // 버튼 제목
                    onPress: () => deactivateRequest(deactivateInfo),
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
