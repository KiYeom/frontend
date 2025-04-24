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

const AdsModal = ({
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
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ModalInner>
            <View
              style={{
                width: '100%',
                backgroundColor: '#191D30',
                borderTopEndRadius: 30,
                borderTopStartRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: rsHeight * 30,
                paddingBottom: rsHeight * 10,
              }}>
              <Image source={imageSource} style={{ width: 140, height: 140 }} />
            </View>

            <ModalContent>{modalContent}</ModalContent>

            <View
              style={{
                width: '100%',
                paddingBottom: rsHeight * 30,
                paddingHorizontal: rsWidth * 24,
              }}>
              <Button
                title="확인"
                primary={true}
                onPress={() => {
                  onClose?.();
                }}
              />
            </View>
          </ModalInner>
        </View>
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
  font-size: ${rsWidth * 14 + 'px'};
  font-family: 'Pretendard-Regular';
  color: black;
  padding-horizontal: ${rsWidth * 24 + 'px'};
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

export default AdsModal;
