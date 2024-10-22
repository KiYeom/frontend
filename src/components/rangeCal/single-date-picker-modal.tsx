import styled from '@emotion/native';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import { getIsoString } from '../../utils/times';
import Button from '../button/button';

const isDateInList = (date: DateType | null, dateList: string[]): boolean => {
  // null 또는 undefined가 입력된 경우 false 반환
  if (date === null || date === undefined) {
    return false;
  }

  // date를 Date 객체로 변환
  let targetDate: Date;

  if (typeof date === 'string' || typeof date === 'number') {
    // 문자열 또는 숫자일 경우 Date로 변환
    targetDate = new Date(date);
  } else if (date instanceof Date) {
    // 이미 Date 객체라면 그대로 사용
    targetDate = date;
  } else if (dayjs.isDayjs(date)) {
    // Dayjs 객체라면 Date 객체로 변환
    targetDate = date.toDate();
  } else {
    return false; // 알 수 없는 타입의 date인 경우 false 반환
  }

  // 입력된 Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
  const dateStr = getIsoString(targetDate).split('T')[0];

  console.log('picker: ', targetDate, dateStr);
  console.log('picker: ', dateList);
  // 변환된 문자열이 dateList에 포함되어 있는지 확인
  return dateList.includes(dateStr);
};

type SingleDatePickerModalProps = {
  modalVisible?: boolean;
  availableDates?: string[];
  onClose?: () => void;
  onChange?: (date: any) => void;
};

const SingleDatePickerModal = (props: SingleDatePickerModalProps) => {
  const { modalVisible, availableDates = [], onClose, onChange } = props;
  const [date, setDate] = useState<Date>(new Date());

  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <ModalContainer>
          <TouchableWithoutFeedback>
            <ModalInner>
              <View>
                <DateTimePicker
                  mode="single"
                  locale="kor"
                  onChange={(newDate) => {
                    //console.log('newDate', newDate);
                    setDate(new Date(newDate.date));
                  }}
                  date={date}
                  minDate={new Date('2024-07-01T00:00:00.000Z')}
                  maxDate={new Date('2024-12-31T00:00:00.000Z')}
                  displayFullDays
                  selectedItemColor={palette.primary[400]}
                  disabledDates={(date): boolean => {
                    return !isDateInList(date, availableDates);
                  }}
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
