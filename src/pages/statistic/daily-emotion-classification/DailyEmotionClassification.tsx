import { css } from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { PieChart } from 'react-native-gifted-charts';
import { Text, View } from 'react-native';
import { TLabel } from '../../../apis/analyze.type';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { Container } from '../daily-keyword/Keyword.style';
import { TouchableOpacity } from 'react-native';
import Icon from '../../../components/icons/icons';

type TLabelWithColor = {
  label: string; // 감정 이름 (예 : 만족스러운)
  value: number; // 감정 비율 (예 : 54%)
  color: string; // 감정 색상 (예 : #FF5733)
};

type DailyEmotionClassificationProps = {
  labelsClassification: TLabel[];
};

const DailyEmotionClassification = ({ labelsClassification }: DailyEmotionClassificationProps) => {
  //pieData를 만들어주는 함수
  const generatePieData = (labelsClassification: TLabel[]): TLabelWithColor[] => {
    const result: TLabelWithColor[] = [];
    labelsClassification.map((item, index) => {
      result.push({
        label: item.label,
        value: Math.round(item.percent),
        color: palette.graph[((index + 1) * 100) as keyof typeof palette.graph], // 색상 할당
      });
    });
    return result;
  };

  // pieData 생성
  const pieData: TLabelWithColor[] = generatePieData(labelsClassification);

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

  //범례 전체 컴포넌트
  const renderLegendComponent = (pieData: TLabelWithColor[]) => {
    return (
      <View
        style={css`
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: ${242 * rsWidth + 'px'};
          gap: ${12 * rsWidth + 'px'};
        `}>
        {pieData.map((data, index) => (
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
    <>
      {pieData.length !== 0 && (
        <View
          style={css`
            background-color: white;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            padding-vertical: ${rsHeight * 30 + 'px'};
          `}>
          <PieChart
            data={pieData} //파이차트 데이터
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
                    {pieData[0].value}%
                  </Text>
                  <Text
                    style={css`
                      font-size: ${rsFont * 16 + 'px'};
                      font-family: Pretendard-SemiBold;
                      color: ${palette.neutral[300]};
                    `}>
                    {pieData[0].label}
                  </Text>
                </View>
              );
            }}
          />
          {renderLegendComponent(pieData)}
        </View>
      )}
    </>
  );
};
export default DailyEmotionClassification;
