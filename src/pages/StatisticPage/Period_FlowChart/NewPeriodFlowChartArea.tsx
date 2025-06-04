// EmotionsFlowChart.js

import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import Icon from '../../../components/icons/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * 1) 각 감정 → 해당 밴드의 "중앙 y값"으로 매핑
 *    angry  → 0.5   (밴드 0~1)
 *    sad    → 1.5   (밴드 1~2)
 *    normal → 2.5   (밴드 2~3)
 *    calm   → 3.5   (밴드 3~4)
 *    happy  → 4.5   (밴드 4~5)
 */
const EMOTION_TO_CENTER = {
  angry: 0.5,
  sad: 1.5,
  normal: 2.5,
  calm: 3.5,
  happy: 4.5,
};

/**
 * 2) 스트라이프(밴드) 배경색을 "위에서부터" [happy, calm, normal, sad, angry] 순으로 정의
 *    밴드 전체 높이는 chartHeight = 280 이고, 5등분하면 각 56px (= pixelPerUnit)
 *    - happy  (4~5) → idx=0 → top: 0 * 56
 *    - calm   (3~4) → idx=1 → top: 1 * 56
 *    - normal (2~3) → idx=2 → top: 2 * 56
 *    - sad    (1~2) → idx=3 → top: 3 * 56
 *    - angry  (0~1) → idx=4 → top: 4 * 56
 */
const STRIPE_COLORS = [
  '#FEF9E7', // happy  (밝은 노랑)
  '#E8F8F5', // calm   (연한 민트)
  '#F2F3F4', // normal (연한 회색)
  '#DCEAFF', // sad    (연한 보라)
  '#FDEDEC', // angry  (연한 핑크)
];

/**
 * 3) 감정별 아이콘 컴포넌트 (이모지 예시)
 *    실제 프로젝트에서는 <Image source={require('...')} /> 등으로 교체하세요.
 */
const EmotionIcon = ({ emotion }) => {
  let emoji = '❓';
  switch (emotion) {
    case 'happy':
      emoji = '😀';
      break;
    case 'calm':
      emoji = '😌';
      break;
    case 'normal':
      emoji = '😐';
      break;
    case 'sad':
      emoji = '😢';
      break;
    case 'angry':
      emoji = '😡';
      break;
  }
  return (
    <View style={styles.iconWrapper}>
      <Text style={styles.iconText}>{emoji}</Text>
    </View>
  );
};

/**
 * NewPeriodFlowChartArea 컴포넌트
 *
 * Props:
 *   • emotionsData: API로 받아온 객체. 예:
 *     {
 *       dates: ["2024-10-25", "2024-11-01", "2024-11-24"],
 *       groups: ["angry", "angry", "happy"],
 *       id: 5701,
 *       nickname: "Test_remind"
 *     }
 *
 * 주요 특징:
 *   1) 각 감정 값은 EMOTION_TO_CENTER 맵핑에 따라 0.5,1.5,...,4.5로 지정
 *   2) noOfSections={5}, stepValue={1} 으로 y축 0~5 범위 사용
 *   3) stripeHeight = chartHeight/5 계산 후, 각 밴드를 절대위치로 정확히 그려서
 *      수평 눈금선(dotted grid)에 딱 맞춰 위치
 *   4) x축: 첫 번째/마지막 날짜만 레이블, 나머지는 빈 문자열
 *   5) y축 숫자 레이블은 모두 제거
 *   6) curved={false} → 직선으로 연결
 */
const NewPeriodFlowChartArea = ({ emotionsData }) => {
  // 1) 유효성 검사
  if (
    !emotionsData ||
    !Array.isArray(emotionsData.dates) ||
    !Array.isArray(emotionsData.groups) ||
    emotionsData.dates.length === 0 ||
    emotionsData.dates.length !== emotionsData.groups.length
  ) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>감정 데이터가 없습니다.</Text>
      </View>
    );
  }

  const { dates, groups } = emotionsData;
  const n = dates.length;

  // ──────────────────────────────────────────────────────────────────
  // 2) 화면 너비에 맞춰 "차트가 그려질 영역" 계산
  //    • 좌우 container padding: 16px씩 → 32px
  //    • 왼쪽 아이콘 열 너비: 40px
  //    • 아이콘-차트 사이 간격: 8px
  //    • y축 레이블 영역 확보: 30px (숫자는 쓰진 않지만 공간 확보)
  //    → 나머지를 chartWidth로 사용
  // ──────────────────────────────────────────────────────────────────
  const CONTAINER_PADDING_H = 16 * 2; // 좌우: 32px
  const ICON_COLUMN_WIDTH = 30; // 아이콘 열: 30px
  const ICON_CHART_GAP = 0; // 간격: 0px (간격 제거)
  const YAXIS_LABEL_AREA = 30; // y축 숫자 영역: 30px
  const chartWidth =
    SCREEN_WIDTH - CONTAINER_PADDING_H - ICON_COLUMN_WIDTH - ICON_CHART_GAP - YAXIS_LABEL_AREA;

  // 3) 차트 높이 및 스트라이프(밴드) 계산
  const BASE_CHART_HEIGHT = 280; // 실제 차트 본문 높이(280px)
  const stripeHeight = BASE_CHART_HEIGHT / 5; // 280/5 = 56px

  // 4) x축 간격 계산: n개의 점을 0→chartWidth에 걸쳐 균등 분배
  const spacing = n > 1 ? chartWidth / (n - 1) : chartWidth;

  // 5) dataPoints 생성: { value, label }
  //    • value: EMOTION_TO_CENTER[emotion] (0.5,1.5,…,4.5)
  //    • label: 첫/마지막 인덱스일 때만 "MM-DD", else ''
  const dataPoints = dates.map((dateStr, idx) => {
    const emo = groups[idx]; // ex) 'angry'
    const centerVal = EMOTION_TO_CENTER[emo] ?? 0; // ex) angry→0.5
    const mmdd = dateStr.slice(5); // 'YYYY-MM-DD'→'MM-DD'
    const label = idx === 0 || idx === n - 1 ? mmdd : '';
    return { value: centerVal, label };
  });

  return (
    <View style={styles.container}>
      <View style={styles.chartAreaWrapper}>
        {/* y 축 범례 */}
        <View style={styles.iconsColumn}>
          {['happy', 'calm', 'normal', 'sad', 'angry'].map((emo, idx) => (
            <Icon key={idx} name={`${emo}-emotion`} width={24} height={24} />
          ))}
        </View>
        {/* 그래프 */}
        <View
          style={{
            width: chartWidth,
            height: BASE_CHART_HEIGHT, // 280px
            position: 'relative',
            backgroundColor: 'pink',
            borderColor: 'black',
          }}>
          {/* (1) 배경 스트라이프: 위에서부터 5등분 */}
          {STRIPE_COLORS.map((bgColor, idx) => (
            <View
              key={idx}
              style={{
                position: 'absolute',
                top: idx * stripeHeight, // idx=0→top:0, idx=1→top:56, … idx=4→top:224
                left: 0,
                width: chartWidth,
                height: stripeHeight,
                backgroundColor: bgColor,
              }}
            />
          ))}

          <LineChart
            style={{ position: 'absolute', top: 0, left: 0 }}
            data={dataPoints}
            width={chartWidth}
            height={BASE_CHART_HEIGHT}
            spacing={spacing}
            initialSpacing={0}
            endSpacing={0}
            stepValue={1}
            thickness={3}
            noOfSections={5}
            hideRules={true} // 격자선 숨기기
            hideYAxisText={true}
            hideAxesAndRules={true} // 축과 격자선 모두 숨기기
            xAxisLabelTextStyle={{
              fontSize: 15,
              color: '#555',
              marginTop: 0,
              marginBottom: 0,
            }}
            yAxisLabelWidth={0}
            yAxisOffset={0}
            contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
            chartConfig={{
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
              margin: 0,
              marginTop: 0,
              marginBottom: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
            lineColor="#626262"
            dataPointColor="#626262"
            dataPointsHeight={8}
            dataPointsWidth={8}
            hideDataPoints={false}
            curved={false} // 직선으로 연결
            showVerticalLines={false}
            showHorizontalLines={false} // 점선 제거
            rulesType="none" // 격자선 타입을 none으로 설정
            yAxisColor="transparent"
            xAxisColor="transparent"
            paddingTop={0}
            paddingBottom={0}
            paddingLeft={0}
            paddingRight={0}
            margin={0}
            containerStyle={{ margin: 0, padding: 0 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //전체 그래프 컨테이너
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'yellow',
  },

  chartAreaWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 0, // 간격 제거
  },

  // ── 왼쪽 감정 아이콘 열
  iconsColumn: {
    width: 30, // 고정 너비 40px
    backgroundColor: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },

  // ── 데이터 없을 때 보여줄 UI
  emptyContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default NewPeriodFlowChartArea;
