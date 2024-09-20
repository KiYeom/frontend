import styled from '@emotion/native';
import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Button from '../button/button';
import DateTimePicker, { DateType, ModeType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { DescText } from '../pages/StatisticPage/StatisticMain.style';
import { css } from '@emotion/native';
import { Text } from 'react-native';
import palette from '../../assets/styles/theme';
const SingleDatePickerModal = ({
  modalVisible,
  onClose,
  onChange,
}: {
  modalVisible?: boolean;
  onClose?: () => void;
  onChange?: (date: any) => void;
}) => {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <ModalContainer>
          <TouchableWithoutFeedback>
            <ModalInner>
              <View>
                <DateTimePicker
                  open={true}
                  mode="single"
                  locale="kor"
                  onChange={(newDate) => {
                    console.log('newDate', newDate);
                    setDate(new Date(newDate.date));
                  }}
                  date={date}
                  displayFullDays
                  selectedItemColor={palette.primary[400]}
                />
              </View>
              <Button
                title="입력 완료"
                primary={true}
                disabled={false}
                onPress={() => {
                  //console.log('버튼 선택함');
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
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalInner = styled.View`
  width: auto;
  background-color: white;
  padding: ${rsHeight * 30 + 'px'} ${rsWidth * 20 + 'px'};
  border-radius: 30px;
`;

export default SingleDatePickerModal;
