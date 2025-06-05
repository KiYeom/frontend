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

const NewPeriodFlowChartArea = ({ emotionsData }) => {
  const { dates, groups } = emotionsData;
  const n = dates.length;
  const spacing = n > 1 ? CHART_WIDTH / (n - 1) : CHART_WIDTH;

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
      <View style={{ backgroundColor: 'yellow', width: '100%' }}>
        <SectionTitle>얼마나 많은 감정 변화가 있었을까요?</SectionTitle>
      </View>
      <ChartAreaWrapper>
        {/* y축 범례 (감정 아이콘) */}
        <IconsColumn>
          {['happy', 'calm', 'normal', 'sad', 'angry'].map((emo) => (
            <IconWrapper key={emo}>
              <Icon name={`${emo}-emotion`} width={24} height={24} />
            </IconWrapper>
          ))}
        </IconsColumn>

        {/* 그래프 본문 */}
        <ChartWrapper>
          {/* 배경 스트라이프 */}
          {STRIPE_COLORS.map((bgColor, idx) => (
            <StripeBand key={idx} top={10 + idx * STRIPE_HEIGHT} bgColor={bgColor} />
          ))}

          {/* Gifted LineChart */}
          <LineChart
            style={{ position: 'absolute', top: 0, left: 0 }}
            data={dataPoints}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            spacing={spacing}
            initialSpacing={0}
            stepValue={1}
            noOfSections={5}
            hideYAxisText={true}
            hideRules={true}
            xAxisLabelTextStyle={{
              fontSize: 12,
              color: '#555',
              marginTop: 4,
            }}
            lineColor="#626262"
            dataPointColor="#626262"
            dataPointsHeight={8}
            dataPointsWidth={8}
            hideDataPoints={false}
            curved={false}
            showVerticalLines={false}
            showHorizontalLines={false}
            yAxisColor="transparent"
            xAxisColor="transparent"
          />
        </ChartWrapper>
      </ChartAreaWrapper>
    </Container>
  );
};

export default NewPeriodFlowChartArea;
