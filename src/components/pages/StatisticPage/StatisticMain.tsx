import React from 'react';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import { SafeAreaView } from 'react-native';
import { getTime, formatDate } from '../../../utils/Chatting';
import DatePickerModal from '../../modals/date-picker-modal';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { css } from '@emotion/native';
import DailyEmotionClassification from './DailyEmotionClassification';
import DateLine from '../../atoms/DateLine/DateLine';

//전체 통계 화면
const StatisticMain: React.FC<any> = () => {
  const [now, setNow] = useState<string>('');
  const [date, setDate] = useState<Date>();
  const [openModal, setOpenModal] = React.useState(false);
  const changeDate = () => {
    console.log('changeDate 함수 실행');
    const currentTime = getTime();
    setNow(formatDate(currentTime));
  }; //현재 시간을 가져와서 "yyyy월 mm월 dd일"로 변경하는 함수

  const saveDate = () => {
    setOpenModal(false); //모달을 닫고
    setNow(formatDate(date));
  };

  useEffect(() => {
    changeDate();
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={css`
            flex: 1;
            background-color: pink;
            //gap: ${rsHeight * 16 + 'px'};
            padding-top: ${20 * rsHeight + 'px'};
            padding-bottom: ${40 * rsHeight + 'px'};
          `}>
          <DateLine today={now} onPress={() => setOpenModal(true)} />
          <DailyEmotionClassification />
        </ScrollView>
        <DatePickerModal
          modalVisible={openModal}
          onClose={() => {
            saveDate();
          }}
          onChange={setDate}
        />
      </SafeAreaView>
    </>
  );
};

export default StatisticMain;
