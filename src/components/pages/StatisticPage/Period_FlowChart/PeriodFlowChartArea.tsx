import React, { useState, useEffect } from 'react';
import { View, Text, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { rsWidth, rsFont } from '../../../../utils/responsive-size';
import { periodChart } from '../../../../apis/analyze';

const PeriodFlowChart = ({ emotionsData, setEmotionsData }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const yAxisLabelWidth = 20;
  const screenWidth = Dimensions.get('window').width - 2 * yAxisLabelWidth * rsWidth;

  const buttonLabels = ['분노', '슬픔', '불안', '상처', '당황', '기쁨'];

  // emotionsData가 로드되지 않았거나 activeIndex가 잘못된 경우
  if (emotionsData.length === 0 || !emotionsData[activeIndex] || !emotionsData[activeIndex].chart) {
    return <Text>Loading...</Text>; // 데이터를 불러오기 전 로딩 표시
  }

  const spacing = screenWidth / (emotionsData[activeIndex].chart.length - 1);

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

  const dataWithCustomLabels = emotionsData[activeIndex].chart.map((dataPoint, index) => {
    if (index === 0) {
      return {
        ...dataPoint,
        labelComponent: () => customLabel(dataPoint.date, 'right', index),
      };
    } else if (index === emotionsData[activeIndex].chart.length - 1) {
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
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {buttonLabels.map((label, index) => (
          <Button key={index} title={label} onPress={() => setActiveIndex(index)} />
        ))}
      </View>
      <View style={{ backgroundColor: 'yellow' }}>
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
