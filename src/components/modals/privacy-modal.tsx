import styled, { css } from '@emotion/native';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Checkbox } from 'react-native-ui-lib';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Button from '../button/button';

const PrivacyModal = ({
  modalVisible,
  onClose,
  onSubmit,
}: {
  modalVisible?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
}) => {
  const [legelAllowed, setLegelAllowed] = React.useState<boolean>(false);
  const [pricacyAllowed, setPricacyAllowed] = React.useState<boolean>(false);
  const [fourth, setFourth] = React.useState<boolean>(false);
  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <ModalContainer>
          <TouchableWithoutFeedback>
            <ModalInner>
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
                onPress={() => {
                  setPricacyAllowed(!pricacyAllowed);
                }}>
                <Checkbox
                  value={pricacyAllowed}
                  onValueChange={() => {
                    setPricacyAllowed(!pricacyAllowed);
                  }}
                  label={'개인정보 처리방침에 동의합니다.'}
                  color={pricacyAllowed ? palette.primary[400] : palette.neutral[200]}
                  labelStyle={{ fontSize: 14 }} //라벨 스타일링
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setFourth(!fourth);
                }}>
                <Checkbox
                  value={fourth}
                  onValueChange={() => {
                    setFourth(!fourth);
                  }}
                  label={'만 14세 이상입니다'}
                  color={fourth ? palette.primary[400] : palette.neutral[200]}
                  labelStyle={{ fontSize: 14 }} //라벨 스타일링
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  WebBrowser.openBrowserAsync(
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

              <Button
                title="로그인하기"
                primary={true}
                disabled={!legelAllowed || !pricacyAllowed || !fourth}
                onPress={() => {
                  onSubmit?.();
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
  background-color: white;
  padding: ${rsHeight * 30 + 'px'} ${rsWidth * 20 + 'px'};
  gap: ${rsHeight * 12 + 'px'};
  border-radius: 30px;
`;

export default PrivacyModal;
