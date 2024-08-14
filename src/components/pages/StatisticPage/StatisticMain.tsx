import React from 'react';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import { Platform, SafeAreaView, StatusBar } from 'react-native';
import { getTime, formatDate } from '../../../utils/Chatting';
import DatePickerModal from '../../modals/date-picker-modal';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { css } from '@emotion/native';
import DailyEmotionClassification from './Daily_EmotionClassification/DailyEmotionClassification';
import DateLine from '../../atoms/DateLine/DateLine';
import KeywordArea from './Daily_Keyword/KeywordArea';
import palette from '../../../assets/styles/theme';
//전체 통계 화면
const StatisticMain: React.FC<any> = () => {
  const [date, setDate] = useState<Date>(new Date()); //현재 날짜
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <ScrollView
          style={css`
            flex: 1; //전체 대시보드 스타일링
            background-color: ${palette.neutral[50]};
            padding-horizontal: ${rsWidth * 20 + 'px'};
          `}>
          <DateLine
            value={
              date?.getFullYear() +
              '년 ' +
              String(date.getMonth() + 1).padStart(2, '0') +
              '월 ' +
              String(date.getDate()).padStart(2, '0') +
              '일'
            }
            onPress={() => {
              console.log(setOpenModal(true));
            }}
          />
          <DailyEmotionClassification
            value={
              date?.getFullYear() +
              '-' +
              String(date.getMonth() + 1).padStart(2, '0') +
              '-' +
              String(date.getDate()).padStart(2, '0')
            }
          />
          <KeywordArea
            value={
              date?.getFullYear() +
              '-' +
              String(date.getMonth() + 1).padStart(2, '0') +
              '-' +
              String(date.getDate()).padStart(2, '0')
            }
          />
        </ScrollView>
      </SafeAreaView>
      <DatePickerModal
        modalVisible={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        onChange={setDate}
      />
    </>
  );
};

export default StatisticMain;
