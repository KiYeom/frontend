// EmotionsFlowChart.js

import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import Icon from '../../../components/icons/icons';
import { SectionTitle } from '../StatisticMain.style';
import {
  Container,
  ChartAreaWrapper,
  IconsColumn,
  IconWrapper,
  IconText,
  ChartWrapper,
  StripeBand,
  EmptyContainer,
  EmptyText,
  CHART_WIDTH,
  CHART_HEIGHT,
  STRIPE_HEIGHT,
} from './NewPeriodFlowChartArea.style';

const EMOTION_TO_CENTER = {
  angry: 0.5,
  sad: 1.5,
  normal: 2.5,
  calm: 3.5,
  happy: 4.5,
};

const STRIPE_COLORS = ['#FDEA9B', '#C3EFD5', '#E2E2E2', '#CFC7FD', '#F6B8B8'];
const STRIPE_NEW_COLORS = ['#F6B8B8', '#CFC7FD', '#E2E2E2', '#C3EFD5', '#FDEA9B'];

const NewPeriodFlowChartArea = ({ emotionsData }) => {
  const { dates, groups } = emotionsData;
  console.log('NewPeriodFlowChartArea - emotionsData:', emotionsData);
  const n = dates.length;
  // 수정 코드 (패딩 5px 반영)
  const spacing =
    n > 1
      ? (CHART_WIDTH - 40) / (n - 1) // 양쪽 패딩 5px씩 총 10px 차감
      : 0; // 데이터 1개일 때는 spacing 0

  // dataPoints 생성
  const dataPoints = dates.map((dateStr, idx) => {
    const emo = groups[idx];
    const centerVal = EMOTION_TO_CENTER[emo] ?? 0;
    const mmdd = dateStr.slice(5);
    const label = idx === 0 || idx === n - 1 ? mmdd : '';
    return { value: centerVal, label };
  });

  return (
    <Container>
      <View style={{ alignSelf: 'stretch' }}>
        <SectionTitle>얼마나 많은 감정 변화가 있었을까요?</SectionTitle>
      </View>
      <ChartAreaWrapper>
        {/* y축 범례 (감정 아이콘) */}
        <IconsColumn>
          {['happy', 'calm', 'normal', 'sad', 'angry'].map((emo, index) => (
            <IconWrapper
              key={emo}
              style={{
                position: 'absolute',
                top: index * STRIPE_HEIGHT + STRIPE_HEIGHT / 2,
              }}>
              <Icon name={`${emo}-emotion`} width={24} height={24} />
            </IconWrapper>
          ))}
        </IconsColumn>

        {/* 그래프 본문 */}
        <ChartWrapper>
          {/* 배경 스트라이프 */}
          {STRIPE_NEW_COLORS.map((bgColor, idx) => (
            <StripeBand key={idx} bottom={22 + idx * STRIPE_HEIGHT} bgColor={bgColor} />
          ))}

          {/* Gifted LineChart */}
          <LineChart
            style={{ position: 'absolute', top: 0, left: 0 }}
            disableScroll={true}
            contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
            data={dataPoints}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            spacing={spacing}
            initialSpacing={20}
            endSpacing={20}
            stepValue={1}
            noOfSections={5}
            hideYAxisText={false}
            hideRules={true}
            xAxisLabelTextStyle={{
              color: 'transparent',
              height: 15,
            }}
            color={'#6E6E6E'}
            thickness={2}
            dataPointsColor={'#6E6E6E'}
            lineGradient={false}
            dataPointsHeight={6}
            dataPointsWidth={6}
            dataPointsRadius1={3}
            hideDataPoints={false}
            curved={false}
            showVerticalLines={false}
            showHorizontalLines={true}
            yAxisColor="transparent"
            xAxisColor="transparent"
            maxValue={5}
            minValue={0}
            yAxisOffset={0}
            yAxisThickness={0}
            yAxisLabelWidth={0}
          />
        </ChartWrapper>
      </ChartAreaWrapper>
    </Container>
  );
};

export default NewPeriodFlowChartArea;
