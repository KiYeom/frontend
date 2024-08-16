import React, { useState, useEffect } from 'react';
import { View, Text, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { rsWidth, rsHeight, rsFont } from '../../../../utils/responsive-size';
import { periodChart } from '../../../../apis/analyze';
import { Title } from '../StatisticMain.style';
import dayjs from 'dayjs';
import { css } from '@emotion/native';
import MoodButton from '../../../button/MoodButton';

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
  const [activeIndex, setActiveIndex] = useState(1);
  const yAxisLabelWidth = 20;
  const screenWidth = Dimensions.get('window').width - 2 * yAxisLabelWidth * rsWidth;

  const buttonLabels = ['분노', '슬픔', '불안', '상처', '당황', '기쁨'];
  console.log('~~~~~~~~~~~~PeriodFlowChart~~~~~~~~~', startDate, endDate);
  // emotionsData가 로드되지 않았거나 activeIndex가 잘못된 경우
  if (emotionsData.length === 0 || !emotionsData[activeIndex] || !emotionsData[activeIndex].chart) {
    return <Text>Loading...</Text>; // 데이터를 불러오기 전 로딩 표시
  }

  const filledData = fillMissingDates(emotionsData[activeIndex].chart, startDate, endDate);
  const spacing = screenWidth / (filledData.length - 1);

  const customLabel = (label, alignment, index) => (
    <View
      style={{
        backgroundColor: 'red',
        borderRadius: 5,
        position: 'absolute',
        [alignment]: 0,
      }}>
      <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{label}</Text>
    </View>
  );

  const dataWithCustomLabels = filledData.map((dataPoint, index) => {
    if (index === 0) {
      return {
        ...dataPoint,
        labelComponent: () => customLabel(dataPoint.date, 'right', index),
      };
    } else if (index === filledData.length - 1) {
      return {
        ...dataPoint,
        labelComponent: () => customLabel(dataPoint.date, 'left', index),
      };
    } else {
      return {
        ...dataPoint,
      };
    }
  });

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
          backgroundColor={'black'}
          areaChart
          curved
          data={dataWithCustomLabels}
          height={300}
          width={screenWidth}
          spacing={spacing}
          initialSpacing={0}
          color1="skyblue"
          color2="orange"
          textColor1="red"
          hideDataPoints={true}
          dataPointsColor1="blue"
          dataPointsColor2="red"
          startFillColor1="green"
          startFillColor2="red"
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
