import React, { useState } from 'react';
import { View, Text, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { rsWidth, rsFont } from '../../../../utils/responsive-size';

const PeriodFlowChart = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const yAxisLabelWidth = 20;
  const screenWidth = Dimensions.get('window').width - 2 * yAxisLabelWidth * rsWidth;

  const res = [
    {
      category: 'anger',
      chart: [
        {
          date: '2024-06-19',
          value: 34,
        },
        {
          date: '2024-06-27',
          value: 63,
        },
        {
          date: '2024-07-17',
          value: 21,
        },
      ],
    },
    // 다른 카테고리 생략...
  ];

  const buttonLabels = ['분노', '슬픔', '불안', '상처', '당황', '기쁨'];

  const spacing = screenWidth / (res[activeIndex].chart.length - 1);

  const customLabel = (label, alignment) => (
    <View
      style={{
        backgroundColor: 'red',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
        position: 'absolute',
        [alignment]: 0,
      }}>
      <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{label}</Text>
    </View>
  );

  const dataWithCustomLabels = res[activeIndex].chart.map((dataPoint, index) => {
    if (index === 0) {
      return {
        ...dataPoint,
        labelComponent: () => customLabel(dataPoint.date, 'right'),
      };
    } else if (index === res[activeIndex].chart.length - 1) {
      return {
        ...dataPoint,
        labelComponent: () => customLabel(dataPoint.date, 'left'),
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
          disableScroll={true}
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
