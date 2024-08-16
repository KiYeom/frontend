import styled from '@emotion/native';
import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Button from '../button/button';
import DateTimePicker, { DateType, ModeType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
const RangeDatePickerModal = ({
  modalVisible,
  onClose,
  onChange,
}: {
  modalVisible?: boolean;
  onClose?: () => void;
  onChange?: (range: any) => void;
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [localRange, setLocalRange] = useState<{
    startDate: DateType;
    endDate: DateType;
  }>({
    startDate: dayjs().subtract(7, 'day').startOf('day'), // 일주일 전 날짜
    endDate: dayjs().startOf('day'), // 현재 날짜
  });

  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <ModalContainer>
          <TouchableWithoutFeedback>
            <ModalInner>
              <DateTimePicker
                open={true}
                mode="range"
                locale="kor"
                onChange={(newRange) => {
                  setLocalRange(newRange); // localRange 업데이트
                }}
                startDate={localRange.startDate}
                endDate={localRange.endDate}
                date={date}
                displayFullDays
              />
              <Button
                title="입력 완료"
                primary={true}
                onPress={() => {
                  //setRange({ startDate: range.startDate, endDate: range.endDate });
                  onChange?.(localRange);
                  onClose?.();
                  //console.log('입력완료!!!!!!!!!!!!!', range.startDate, range.endDate);
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
  border-radius: 30px;
`;

export default RangeDatePickerModal;
