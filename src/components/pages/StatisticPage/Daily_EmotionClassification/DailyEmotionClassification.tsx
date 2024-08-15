import React from 'react';
import { css } from '@emotion/native';
import { rsWidth, rsHeight, rsFont } from '../../../../utils/responsive-size';
import { View, Text } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import palette from '../../../../assets/styles/theme';
import { dailyAnalyze } from '../../../../apis/analyze';
import { useEffect, useState } from 'react';
import Empty from '../Empty';
type PieChartData = {
  label: string;
  value: number; //퍼센트값
  color: string; //파이차트에 그릴 색상
};
type LabelClassification = {
  label: string;
  percent: number;
};

const DailyEmotionClassification: React.FC<any> = (props: any) => {
  const { value, isNullClassification, labelsClassification } = props;
  //pieData를 만들어주는 함수
  const generatePieData = (labelsClassification: LabelClassification[]) => {
    return labelsClassification.map((item, index) => {
      //console.log('generatePieData 함수 실행', item.value, item.label);
      return {
        label: item.label,
        value: Math.round(item.percent),
        color: palette.graph[((index + 1) * 100) as keyof typeof palette.graph], // 색상 할당
      };
    });
  };

  const testPieData = generatePieData(labelsClassification);
  //데이터가 있으면 [{"value" : "화나는", "percent" : 29}, ...]
  //데이터가 없으면 []

  //범례의 점 그리기
  const renderDot = (color: any) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  //범례 전체
  const renderLegendComponent = (
    testPieData: { value: number; color: string; label: string }[],
  ) => {
    return (
      <View
        style={css`
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: ${242 * rsWidth + 'px'};
          gap: ${20 * rsWidth + 'px'};
        `}>
        {testPieData.map((data, index) => (
          <View
            key={index}
            style={css`
              flex-direction: row; //전체 컨테이너
              align-items: center;
            `}>
            {renderDot(data.color)}
            <Text
              style={css`
                color: black;
                font-family: Pretendard-Medium;
                font-size: ${16 * rsFont};
              `}>
              {data.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  return (
    <View
      style={css`
        background-color: ${palette.neutral[50]};
        margin-bottom: ${rsHeight * 16 + 'px'};
        flex: 1; //전체 배경
        background-color: purple;
      `}>
      <View
        style={css`
          gap: ${12 * rsHeight + 'px'};
        `}>
        <Text
          style={css`
            font-family: Pretendard-SemiBold;
            font-size: ${rsFont * 18 + 'px'};
          `}>
          감정 분류
        </Text>
        <View
          style={css`
            background-color: white; //통계 차트 박스
            border-radius: 20px;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: ${24 * rsHeight + 'px'};
            padding-vertical: ${rsHeight * 32 + 'px'};
            padding-horizontal: ${rsWidth * 10 + 'px'};
          `}>
          {testPieData.length !== 0 ? (
            <>
              <PieChart
                data={testPieData} //파이차트 데이터
                donut //파이차트 형태 (도넛)
                showGradient={false} //도넛에 생기는 그림자
                sectionAutoFocus
                radius={(200 * rsWidth) / 2} //도넛 차트 반지름 (큰 원)
                innerRadius={(125 * rsWidth) / 2} //도넛 차트 반지름 (작은=뚫려있는 원)
                innerCircleColor={'white'} //작은 원(=뚫려있는 원) 반지름 색상
                centerLabelComponent={() => {
                  //작은 원 (=뚫려있는 원) 안에 label (47% Excellent)
                  return (
                    <View
                      style={css`
                        display: flex; //label 글자 칸
                        justify-content: center;
                        align-items: center;
                        gap: ${4 * rsHeight + 'px'};
                      `}>
                      <Text
                        style={css`
                          font-size: ${rsFont * 28 + 'px'}; //퍼센트 작성 글자 크기
                          font-family: Pretendard-Bold;
                          color: black;
                        `}>
                        {testPieData[0].value}%
                      </Text>
                      <Text
                        style={css`
                          font-size: ${rsFont * 16 + 'px'};
                          font-family: Pretendard-SemiBold;
                          color: ${palette.neutral[300]};
                        `}>
                        {testPieData[0].label}
                      </Text>
                    </View>
                  );
                }}
              />
              {renderLegendComponent(testPieData)}
            </>
          ) : (
            <Empty type="채팅기록"></Empty>
          )}
        </View>
      </View>
    </View>
  );
};
export default DailyEmotionClassification;
