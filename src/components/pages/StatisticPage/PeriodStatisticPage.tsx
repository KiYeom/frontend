import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Platform } from 'react-native';
import { css } from '@emotion/native';
import styled from '@emotion/native';
import DatePickerModal from '../../modals/date-picker-modal';
import { useState } from 'react';
import ReportType from './ReportType';
import { useNavigation } from '@react-navigation/native';
import { rsHeight, rsWidth, rsFont } from '../../../utils/responsive-size';
const PeriodStatisticPage: React.FC<any> = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [date, setDate] = useState<Date>(new Date()); //현재 날짜
  const navigation = useNavigation();
  return (
    <>
      <SafeAreaView
        style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <ScrollView
          style={css`
            flex: 1; //통계 전체 컨테이너 (대시보드)
            flex-direction: column;
            background-color: orange;
            padding-vertical: ${rsHeight * 16 + 'px'};
            padding-horizontal: ${rsWidth * 20 + 'px'};
          `}>
          <ReportType
            type="일일리포트"
            navigation={navigation}
            onPress={() => {
              console.log(setOpenModal(true));
            }}></ReportType>
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
export default PeriodStatisticPage;
