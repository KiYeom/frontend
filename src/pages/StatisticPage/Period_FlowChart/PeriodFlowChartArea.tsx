import { css } from '@emotion/native';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import MoodButton from '../../../components/button/MoodButton';
import { SectionTitle } from '../StatisticMain.style';
import { getDemoActivePush } from '../../../apis/demo';
import { getIsDemo, setIsScoreDemo } from '../../../utils/storageUtils';
import Icon from '../../../components/icons/icons';
import palette from '../../../assets/styles/theme';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const fillMissingDates = (data: object, startDate: string, endDate: string) => {
  const result = [];
  let currentDate = dayjs(startDate); //

  const endDateObj = dayjs(endDate);
  //console.log('😀data', startDate, endDate, data);
  //console.log('😀data type😀', typeof startDate, typeof endDate, data);
  //console.log('😀currentDate', currentDate);
  //console.log('😀endDateObj', endDateObj);

  const newCurrentDate = dayjs.tz(startDate, 'Asia/Seoul');
  //console.log('😀newCurrentDate', newCurrentDate.format());

  let dataIndex = 0;

  while (currentDate.isBefore(endDateObj.add(1, 'day'))) {
    const currentDateString = currentDate.format('YYYY-MM-DD');
    //console.log('😀😀😀😀😀', currentDateString);

    if (dataIndex < data.length && data[dataIndex].date === currentDateString) {
      // 데이터에 현재 날짜가 있으면 그대로 추가
      //console.log(currentDateString, 'currentDateString 있음😀😀😀😀😀', data[dataIndex]);
      result.push(data[dataIndex]);
      dataIndex++; // 다음 데이터 포인터로 이동
    } else {
      // 데이터에 현재 날짜가 없으면 value: 0으로 추가
      //console.log(currentDateString, 'currentDateString 없음😀😀😀😀😀', data[dataIndex]);
      result.push({ date: currentDateString, value: 0 });
    }

    currentDate = currentDate.add(1, 'day'); // 다음 날짜로 이동
  }
  //console.log('👍👍👍👍👍 result ', result);
  return result;
};

const HINT_NAME = 'period-flow';
const HINT_MESSAGE = '그 동안 자신의 감정 변화를 객관적으로 한 눈에 불 수 있어요!';

const PeriodFlowChart = ({ emotionsData, startDate, endDate, hintStatus, setHintStatus }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const yAxisLabelWidth = 20;
  const screenWidth = Dimensions.get('window').width - 2 * yAxisLabelWidth * rsWidth;

  const buttonLabels = ['분노', '슬픔', '불안', '상처', '당황', '기쁨'];

  const filledData = fillMissingDates(emotionsData[activeIndex].chart, startDate, endDate);
  const spacing = screenWidth / (filledData.length - 1);

  return (
    <>
      <View
        style={css`
          padding-horizontal: ${rsWidth * 20 + 'px'};
          width: 100%;
        `}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <SectionTitle>얼마나 많은 감정 변화가 있었을까요?</SectionTitle>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}>
            {/*<Hint
              visible={hintStatus && hintStatus === HINT_NAME}
              position={Hint.positions.TOP}
              message={HINT_MESSAGE}
              color={'white'}
              enableShadow
              messageStyle={css`
                font-family: Kyobo-handwriting;
                font-size: ${16 * rsFont + 'px'};
                color: ${palette.neutral[900]};
              `}
              onPress={() => setHintStatus(undefined)}
              onBackgroundPress={() => setHintStatus(undefined)}>
              <View>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 4,
                    backgroundColor: 'yellow',
                  }}
                  onPress={() => setHintStatus(hintStatus ? undefined : HINT_NAME)}>
                  <Icon name="information" width={16} height={16} />
                </TouchableOpacity>
              </View>
            </Hint>*/}
          </View>
        </View>
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
                if (!getIsDemo()) return;
              }}
            />
          ))}
        </View>
      </View>
      <View
        style={css`
          //background-color: 'yellow';
          margin-bottom: ${rsHeight * 16 + 'px'};
        `}>
        <LineChart
          yAxisTextStyle={{
            color: '#B6BDC6',
            fontSize: 12 * rsFont,
            fontFamily: 'Pretendard-Regular',
          }}
          disableScroll={false}
          areaChart
          curved
          data={filledData}
          height={300}
          width={screenWidth}
          spacing={spacing}
          initialSpacing={0}
          color1="skyblue"
          color2="orange"
          hideDataPoints={true}
          dataPointsColor1="#58C3A5"
          startFillColor1="#58C3A5"
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
