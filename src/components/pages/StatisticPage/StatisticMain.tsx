import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const StatisticMain: React.FC<any> = () => {
  //화면에 그릴 데이터
  const pieData = [
    {
      value: 47, //퍼센트
      color: '#009FFF', //색상
      gradientCenterColor: '#006DFF', //?
      focused: true, //가장 큰 거
    },
    { value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE' },
    { value: 16, color: '#BDB2FA', gradientCenterColor: '#8F80F3' },
    { value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97' },
  ];

  //범례에 동그란 점
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
  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#006DFF')}
            <Text style={{ color: 'white' }}>Excellent: 47%</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
            {renderDot('#8F80F3')}
            <Text style={{ color: 'white' }}>Okay: 16%</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#3BE9DE')}
            <Text style={{ color: 'white' }}>Good: 40%</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
            {renderDot('#FF7F97')}
            <Text style={{ color: 'white' }}>Poor: 3%</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingVertical: 100,
          backgroundColor: '#34448B',
          flex: 1, //전체 배경
        }}>
        <View
          style={{
            margin: 20,
            padding: 16,
            borderRadius: 20,
            backgroundColor: '#232B5D', //통계 차트 박스
          }}>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <PieChart
              data={pieData} //파이차트 데이터
              donut //파이차트 형태 (도넛)
              showGradient //도넛에 생기는 그림자
              sectionAutoFocus
              radius={90} //도넛 차트 반지름 (큰 원)
              innerRadius={60} //도넛 차트 반지름 (작은=뚫려있는 원)
              innerCircleColor={'#232B5D'} //작은 원(=뚫려있는 원) 반지름 색상
              centerLabelComponent={() => {
                //작은 원 (=뚫려있는 원) 안에 label (47% Excellent)
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center', //label 글자 칸
                    }}>
                    <Text
                      style={{
                        fontSize: 22,
                        color: 'white',
                        fontWeight: 'bold', //퍼센트 작성 글자 크기
                      }}>
                      47%
                    </Text>
                    <Text style={{ fontSize: 14, color: 'white' }}>Excellent</Text>
                  </View>
                );
              }}
            />
          </View>
          {renderLegendComponent() /* 범례 표 작성하는 함수 호출 */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StatisticMain;
