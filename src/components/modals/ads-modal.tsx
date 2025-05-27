import styled, { css } from '@emotion/native';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  ImageSourcePropType,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Button from '../button/button';
import NewCheckBox from '../v3-checkbox/NewCheckBox';
import { Image } from 'react-native';
import { useState } from 'react';

const TierModal = ({
  modalVisible,
  onClose,
  onSubmit,
  imageSource,
  modalContent,
  isButtonDisabled = false, // 외부에서 제어 가능
}: {
  modalVisible?: boolean;
  onClose?: (type: 'cancel' | 'submit') => void;
  onSubmit?: () => void;
  imageSource?: ImageSourcePropType;
  modalContent?: string;
  isButtonDisabled?: boolean; // 버튼 비활성화 여부
}) => {
  // 버튼 비활성화를 위한 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDisabled = isSubmitting || isButtonDisabled;
  const handleSubmit = async () => {
    console.log('저장하기 버튼을 누름');
    if (isSubmitting) return; // 이미 처리 중이면 무시

    try {
      setIsSubmitting(true);
      await onSubmit?.();
      //handleClose(); // 성공 시에만 모달 닫기
      onClose?.('submit');
    } catch (error) {
      console.error('Submit error:', error);
      // 에러 토스트 메시지 표시
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose?.('cancel'); //취소 버튼을 누름
    // 모달 닫을 때 상태 초기화
    setIsSubmitting(false);
    //console.log('취소 버튼을 눌렀어요');
  };

  return (
    <View>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ModalInner onStartShouldSetResponder={() => true}>
            <Image source={imageSource} style={{ width: 140, height: 140 }} />

            <ModalContent>{modalContent}</ModalContent>

            <ButtonGroup>
              <View style={{ width: '50%' }}>
                <Button
                  title={'취소'}
                  primary={false}
                  disabled={isSubmitting} // 제출 중일 때 취소 버튼도 비활성화
                  onPress={handleCancel}
                />
              </View>
              <View style={{ width: '50%' }}>
                <Button
                  title={'저장하기'}
                  primary={true}
                  disabled={isSubmitting} // 중복 실행 방지
                  onPress={handleSubmit}
                />
              </View>
            </ButtonGroup>
          </ModalInner>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalInner = styled.View`
  width: 300px;
  background-color: white;
  padding: ${rsHeight * 30 + 'px'} ${rsWidth * 24 + 'px'};
  gap: ${rsHeight * 12 + 'px'};
  border-radius: 30px;
  justify-content: center;
  align-items: center;
`;

const ModalInnerTier = styled.View`
  width: 350px;
  background-color: #ffffff;
  padding: ${rsHeight * 30 + 'px'} ${rsWidth * 24 + 'px'};
  gap: ${rsHeight * 12 + 'px'};
  border-radius: 30px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: ${rsWidth * 20 + 'px'};
  font-family: 'Pretendard-SemiBold';
  text-align: center;
  color: black;
`;

const ModalContent = styled.Text`
  font-size: ${rsWidth * 15 + 'px'};
  font-family: 'Pretendard-Regular';
  color: black;
  text-align: center;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: ${rsWidth * 8 + 'px'};
  //background-color: red;
  height: 50px;
`;

const ButtonSingleGroup = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: red;
`;

export default TierModal;
