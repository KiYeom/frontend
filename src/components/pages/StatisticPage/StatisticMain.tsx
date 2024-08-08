import React from 'react';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import { SafeAreaView } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { dailyAnalyze } from '../../../apis/analyze';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { css } from '@emotion/native';
import DailyEmotionClassification from './DailyEmotionClassification';

//전체 통계 화면
const StatisticMain: React.FC<any> = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={css`
          flex: 1;
          background-color: pink;
          gap: ${16 * rsHeight + 'px'};
          padding-top: ${20 * rsHeight + 'px'};
          padding-bottom: ${40 * rsHeight + 'px'};
        `}>
        <DailyEmotionClassification />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatisticMain;
