import styled, { css } from '@emotion/native';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
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
              <Image
                source={require('../../assets/images/cookie_pic_alarm.png')}
                style={{ width: '100ox', height: '100px' }}
              />
              <ModalContent>사진은 한 장만 등록할 수 있습니다.</ModalContent>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setLegelAllowed(!legelAllowed);
                }}>
                {/*<Checkbox
                  value={legelAllowed}
                  onValueChange={() => {
                    setLegelAllowed(!legelAllowed);
                  }}
                  label={'서비스 이용약관에 동의합니다.'}
                  color={legelAllowed ? palette.primary[400] : palette.neutral[200]}
                  labelStyle={{ fontSize: 14 }} //라벨 스타일링
                />*/}
                <NewCheckBox
                  checked={legelAllowed}
                  onToggle={() => setLegelAllowed(!legelAllowed)}
                  message="서비스 이용약관에 동의합니다"
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
              <ButtonGroup>
                <Button
                  title="뒤로가기"
                  primary={false}
                  onPress={() => {
                    onClose?.();
                  }}
                />
                <Button
                  title="비회원 시작"
                  primary={true}
                  disabled={!legelAllowed}
                  onPress={() => {
                    onSubmit?.();
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

export default TierModal;
