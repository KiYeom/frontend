import styled from '@emotion/native';
import React from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
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
              <ButtonGroup>
                <Button
                  title="비회원 시작"
                  primary={false}
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
  padding: ${rsHeight * 30 + 'px'} ${rsWidth * 20 + 'px'};
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
  text-align: center;
  color: black;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-around;
  gap: ${rsWidth * 8 + 'px'};
`;

export default GuestModal;
