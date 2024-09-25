import styled, { css } from '@emotion/native';
import React from 'react';
import { Linking, Modal, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Checkbox } from 'react-native-ui-lib';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Button from '../button/button';

const GuestModal = ({
  modalVisible,
  onClose,
  onSubmit,
}: {
  modalVisible?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
}) => {
  const [legelAllowed, setLegelAllowed] = React.useState<boolean>(false);

  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <ModalContainer>
          <TouchableWithoutFeedback>
            <ModalInner>
              <ModalTitle>비회원으로 시작하시겠습니까?</ModalTitle>
              <ModalContent>
                비회원 사용자는 앱을 삭제 시 캐릭터와의 대화, 감정분석 결과 등 모든 데이터가
                소멸됩니다.{' '}
              </ModalContent>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setLegelAllowed(!legelAllowed);
                }}>
                <Checkbox
                  value={legelAllowed}
                  onValueChange={() => {
                    setLegelAllowed(!legelAllowed);
                  }}
                  label={'서비스 이용약관에 동의합니다.'}
                  color={legelAllowed ? palette.primary[400] : palette.neutral[200]}
                  labelStyle={{ fontSize: 14 }} //라벨 스타일링
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  Linking.openURL(
                    'https://autumn-flier-d18.notion.site/reMIND-167ef1180e2d42b09d019e6d187fccfd',
                  )
                }>
                <Text
                  style={css`
                    text-align: center;
                    justify-content: center;
                    align-items: end;
                    text-family: 'Prentendard-Regular';
                    color: blue;
                  `}>
                  약관 확인
                </Text>
              </TouchableOpacity>
              <ButtonGroup>
                <Button
                  title="비회원 시작"
                  primary={false}
                  disabled={!legelAllowed}
                  onPress={() => {
                    onSubmit?.();
                    onClose?.();
                  }}
                />
                <Button
                  title="로그인 하러가기"
                  primary={true}
                  onPress={() => {
                    onClose?.();
                  }}
                />
              </ButtonGroup>
            </ModalInner>
          </TouchableWithoutFeedback>
        </ModalContainer>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalInner = styled.View`
  width: 350px;
  background-color: #ffffff;
  padding: ${rsHeight * 30 + 'px'} ${rsWidth * 24 + 'px'};
  gap: ${rsHeight * 12 + 'px'};
  border-radius: 30px;
`;

const ModalTitle = styled.Text`
  font-size: ${rsWidth * 20 + 'px'};
  font-family: 'Pretendard-SemiBold';
  text-align: center;
  color: black;
`;

const ModalContent = styled.Text`
  font-size: ${rsWidth * 14 + 'px'};
  font-family: 'Pretendard-Regular';
  color: black;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: ${rsWidth * 8 + 'px'};
`;

export default GuestModal;
