import styled, { css } from '@emotion/native';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Button from '../button/button';
import NewCheckBox from '../v3-checkbox/NewCheckBox';
import { Image } from 'react-native';

const TierModal = ({
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
              <View
                style={{
                  gap: rsHeight * 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/images/cookie_pic_alarm.png')}
                  style={{ width: 140, height: 140 }}
                />
                <ModalContent>사진은 한 장만 등록할 수 있습니다.</ModalContent>
              </View>
              <Button
                title="확인"
                primary={true}
                onPress={() => {
                  onClose?.();
                }}
              />
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
  font-size: ${rsWidth * 14 + 'px'};
  font-family: 'Pretendard-Regular';
  color: black;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: ${rsWidth * 8 + 'px'};
`;

const ButtonSingleGroup = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: red;
`;

export default TierModal;
