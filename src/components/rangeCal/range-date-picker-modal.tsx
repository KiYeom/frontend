import styled from '@emotion/native';
import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Button from '../button/button';
import { DescText } from '../pages/StatisticPage/StatisticMain.style';

const RangeDatePickerModal = ({
  modalVisible,
  onClose,
  onChange,
  range,
}: {
  modalVisible?: boolean;
  onClose?: () => void;
  onChange?: (range: any) => void;
  range?: DateType;
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [localRange, setLocalRange] = useState<{
    startDate: DateType;
    endDate: DateType;
  }>({
    startDate: range.startDate, // 일주일 전 날짜
    endDate: range.endDate, // 현재 날짜
  });
  //두 날짜의 차이가 하루 이하면 버튼 비활성화
  const validateDate = (startDate: any, endDate: any) => {
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    if (!startDate || !endDate) {
      return false;
    }
    if (endDate - startDate <= oneDayInMillis) {
      return false;
    }
    return true;
  };

  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <ModalContainer>
          <TouchableWithoutFeedback>
            <ModalInner>
              <View>
                <DateTimePicker
                  mode="range"
                  locale="kor"
                  onChange={(newRange) => {
                    setLocalRange(newRange); // localRange 업데이트
                  }}
                  startDate={localRange.startDate}
                  endDate={localRange.endDate}
                  minDate={new Date('2024-07-01T00:00:00.000Z')}
                  maxDate={new Date('2024-12-31T00:00:00.000Z')}
                  date={date}
                  displayFullDays
                  selectedItemColor={palette.primary[400]}
                />
              </View>
              <DescText>
                {!validateDate(localRange.startDate, localRange.endDate) &&
                  '날짜를 올바르게 입력해주세요.'}
              </DescText>
              <Button
                title="입력 완료"
                primary={true}
                disabled={!validateDate(localRange.startDate, localRange.endDate)}
                onPress={() => {
                  onChange?.(localRange);
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

export default RangeDatePickerModal;
