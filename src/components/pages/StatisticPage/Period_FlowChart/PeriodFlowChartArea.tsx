import { css } from '@emotion/native';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { rsFont, rsHeight, rsWidth } from '../../../../utils/responsive-size';
import MoodButton from '../../../button/MoodButton';
import { Title } from '../StatisticMain.style';

const fillMissingDates = (data, startDate, endDate) => {
  const result = [];
  let currentDate = dayjs(startDate);

  const endDateObj = dayjs(endDate);

  let dataIndex = 0;

  while (currentDate.isBefore(endDateObj)) {
    const currentDateString = currentDate.format('YYYY-MM-DD');

    if (dataIndex < data.length && data[dataIndex].date === currentDateString) {
      // 데이터에 현재 날짜가 있으면 그대로 추가
      result.push(data[dataIndex]);
      dataIndex++; // 다음 데이터 포인터로 이동
    } else {
      // 데이터에 현재 날짜가 없으면 value: 0으로 추가
      result.push({ date: currentDateString, value: 0 });
    }

    currentDate = currentDate.add(1, 'day'); // 다음 날짜로 이동
  }

  return result;
};

const PeriodFlowChart = ({ emotionsData, setEmotionsData, startDate, endDate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const yAxisLabelWidth = 20;
  const screenWidth = Dimensions.get('window').width - 2 * yAxisLabelWidth * rsWidth;

  const buttonLabels = ['분노', '슬픔', '불안', '상처', '당황', '기쁨'];

  const filledData = fillMissingDates(emotionsData[activeIndex].chart, startDate, endDate);
  const spacing = screenWidth / (filledData.length - 1);

  return (
    <>
      <View
        style={css`
          padding-horizontal: ${rsWidth * 20 + 'px'};
        `}>
        <Title>감정 변화 추이</Title>
        <View
          style={css`
            flex-direction: row;
            justify-content: space-between;
            padding-horizontal: ${rsWidth * 4 + 'px'};
            padding-vertical: ${rsHeight * 6 + 'px'};
          `}>
          {buttonLabels.map((label, index) => (
            <MoodButton
              key={index}
              title={label}
              primary={index === activeIndex}
              onPress={() => {
                //console.log('filledData', filledData);
                //console.log('emotionsData[activeIndex].chart', emotionsData[activeIndex].chart);
                //console.log('activeIndex', activeIndex);
                setActiveIndex(index);
              }}
            />
          ))}
        </View>
      </View>
      <View
        style={css`
          background-color: 'yellow';
          margin-bottom: ${rsHeight * 16 + 'px'};
        `}>
        <LineChart
          yAxisTextStyle={{
            color: '#B6BDC6',
            fontSize: 12 * rsFont,
            fontFamily: 'Pretendard-Regular',
          }}
          disableScroll={false}
          areaChart
          curved
          data={filledData}
          height={300}
          width={screenWidth}
          spacing={spacing}
          initialSpacing={0}
          color1="skyblue"
          color2="orange"
          hideDataPoints={true}
          dataPointsColor1="#58C3A5"
          startFillColor1="#58C3A5"
          startOpacity={0.5}
          endOpacity={0.2}
          maxValue={100}
          stepValue={50}
          xAxisColor={'transparent'}
          yAxisColor={'transparent'}
          hideRules={true}
          endSpacing={0}
          yAxisLabelWidth={yAxisLabelWidth * rsWidth}
        />
      </View>
    </>
  );
};

export default PeriodFlowChart;
