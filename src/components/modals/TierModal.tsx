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
import Button from '../button/Button';
import CheckBox from '../checkbox/CheckBox';
import { Image } from 'react-native';

const TierModal = ({
  modalVisible,
  onClose,
  onSubmit,
  imageSource,
  modalContent,
  type = 'normal', //기본값 설정
}: {
  modalVisible?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  imageSource?: ImageSourcePropType;
  modalContent?: string;
  type?: 'normal' | 'ads';
}) => {
  const [legelAllowed, setLegelAllowed] = React.useState<boolean>(false);

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

            <View style={{ width: '100%' }}>
              <Button
                title={type === 'ads' ? '광고 시청하기' : '확인'}
                primary={true}
                onPress={() => {
                  onSubmit?.();
                }}
              />
            </View>
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
