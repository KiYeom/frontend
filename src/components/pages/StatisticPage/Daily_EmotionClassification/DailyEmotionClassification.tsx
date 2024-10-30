import { css } from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { PieChart } from 'react-native-gifted-charts';
import { Text, View } from 'react-native-ui-lib';
import { TLabel } from '../../../../apis/analyze.type';
import palette from '../../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../../utils/responsive-size';
import BlurredButton from '../BlurredButton';
import { Container } from '../Daily_Keyword/Keyword.style';
import { SectionTitle } from '../StatisticMain.style';
type TLabelWithColor = {
  label: string;
  value: number;
  color: string;
};

const DailyEmotionClassification: React.FC<any> = (props: any) => {
  const { isNullClassification, labelsClassification } = props;
  const navigation = useNavigation(); // 네비게이션 훅 사용
  //pieData를 만들어주는 함수
  const generatePieData = (labelsClassification: TLabel[]): TLabelWithColor[] => {
    const result: TLabelWithColor[] = [];
    labelsClassification.map((item, index) => {
      //console.log('generatePieData 함수 실행', item.value, item.label);
      result.push({
        label: item.label,
        value: Math.round(item.percent),
        color: palette.graph[((index + 1) * 100) as keyof typeof palette.graph], // 색상 할당
      });
    });
    return result;
  };

  const pieData: TLabelWithColor[] = generatePieData(labelsClassification);
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
    <Container>
      <SectionTitle>쿠키가 생각했을 때의 모습이에요</SectionTitle>
      {pieData.length !== 0 ? (
        <>
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
        </>
      ) : (
        <BlurredButton
          blurredImageUri={
            'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/statistic/samplegraph.png'
          } // 로컬에 저장된 블러 이미지 경로
          text={'쿠키와 대화하고\n나의 마음을 알아보세요'}
          buttonText="지금 대화하기"
          onPress={() => {
            // 버튼 클릭 시 실행될 함수
            console.log('첫번째 버튼 클릭됨');
            //navigation.replace(RootStackName.HomeStackNavigator, { screen: HomeStackName.Chat });
            // 채팅 화면으로 가는데, 채팅 화면의 뒤로가기 버튼을 누르면 이 화면 말고 홈 화면으로 가야할 것 같음..
            console.log('버튼 클릭함');
          }}
        />
      )}
      {/*</View>*/}
    </Container>
  );
};
export default DailyEmotionClassification;
