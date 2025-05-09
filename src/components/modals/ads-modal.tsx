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

const TierModal = ({
  modalVisible,
  onClose,
  onSubmit,
  imageSource,
  modalContent,
}: {
  modalVisible?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  imageSource?: ImageSourcePropType;
  modalContent?: string;
}) => {
  return (
    <View>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onClose}>
          <ModalInner>
            <Image source={imageSource} style={{ width: 140, height: 140 }} />

            <ModalContent>{modalContent}</ModalContent>

            <ButtonGroup>
              <View style={{ width: '50%' }}>
                <Button
                  title={'취소'}
                  primary={false}
                  onPress={() => {
                    onClose?.();
                  }}
                />
              </View>
              <View style={{ width: '50%' }}>
                <Button
                  title={'저장하기'}
                  primary={true}
                  onPress={() => {
                    onSubmit?.();
                  }}
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
`;

const ButtonSingleGroup = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: red;
`;

export default TierModal;
