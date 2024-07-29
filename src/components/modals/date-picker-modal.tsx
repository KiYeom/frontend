import styled, { css } from '@emotion/native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Button from '../button/button';
import DatePicker from 'react-native-date-picker';

const DatePickerModal = ({
  modalVisible,
  onClose,
  onChange,
}: {
  modalVisible?: boolean;
  onClose?: () => void;
  onChange?: (date: Date) => void;
}) => {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Modal visible={modalVisible} transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <ModalContainer>
          <TouchableWithoutFeedback>
            <ModalInner>
              <DatePicker
                open={true}
                date={date}
                locale="kor"
                mode="date"
                onDateChange={(new_date) => setDate(new_date)}
              />
              <Button
                title="입력 완료"
                primary={true}
                onPress={() => {
                  onChange?.(date);
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
  backgroundcolor: rgba(0, 0, 0, 0.5);
`;

const ModalInner = styled.View`
  width: 350px;
  background-color: white;
  padding: ${rsHeight * 30 + 'px'} ${rsWidth * 20 + 'px'};
  border-radius: 30px;
`;

export default DatePickerModal;
