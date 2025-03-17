import { setLogLevel } from '@react-native-firebase/app';
import react, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, CalendarList, Agenda, DateData, LocaleConfig } from 'react-native-calendars';
import { rsHeight, rsWidth, rsFont } from '../../utils/responsive-size';
import Icon from '../icons/icons';
import palette from '../../assets/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { periodRecordEmotions } from '../../apis/analyze';
import { HomeStackName, RootStackName } from '../../constants/Constants';
import { useCalendarStore } from '../../store/calendarStore';
/*
DateData 
{
"dateString": "2025-03-13",
"day": 13,
"month": 3,
"timestamp": 1741824000000,
"year": 2025}
*/

LocaleConfig.locales['fr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수묘일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = 'fr';

const getBackgroundColor = (status) => {
  switch (status) {
    case 'future_date':
      return '#F8F8F8'; // 미래 날짜 (비활성화)
    case 'past_no_entry':
      return '#DFDFDF'; // 과거 작성 없음
    case 'today-no-entry':
      return `${palette.primary[50]}`; // 오늘 작성 없음 (플러스버튼)
    case 'sad-emotion':
      return '#BCB2FF'; // 감정 일기 기록 (슬픈)
    case 'angry-emotion':
      return '#F49B9B'; //감정 일기 기록 (분노)
    case 'happy-emotion':
      return '#FFE372'; // 감정 일기 기록 (행복)
    case 'calm-emotion':
      return '#ABEBC5'; // 감정 일기 기록 (평온)
    case 'today_no_emotion_analysis':
      return '#F1C40F'; // 감정 분석 안된 채팅
    default:
      return '#FFFFFF'; // 기본 색상
  }
};

const getDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');

  const dateString = year + '-' + month + '-' + day; // 2023-06-18

  return dateString;
};
/*
날짜의 상태
1. 과거의 날짜인데
  - 작성 이력이 없는 날 : past_no_entry
  - 네 가지 감정 중 하나가 작성된 날 record_emotion
2. 현재의 날짜인데
  - 작성 이력이 없는 날 today_no_entry
  - 네 가지 감정 중 하나가 작성된 날 record_emotion
  - 채팅을 하였지만, 감정은 분석이 안 된 날 today_no_emotion_analysis
3. 미래의 날짜 future_date


[1] 앱을 실행하면, 현재 날짜의 달의 모든 정보를 받아온다. (기간 리포트 api)
[2] 정보에 따라 날짜의 상태를 구분한다.
[3] 구분한 날짜의 상태대로 화면에 그린다.
*/

const CustomCalendar = ({ navigation }) => {
  const [selected, setSelected] = useState<string>('');
  const { calendarData, fetchCalendarData, updateEntryStatus, logCalendarState } =
    useCalendarStore();

  useEffect(() => {
    fetchCalendarData();
  }, []);

  return (
    <Calendar
      style={{
        borderWidth: 1,
        borderColor: 'gray',
        height: 'auto',
        width: rsWidth * 350,
      }}
      //캘린더에 미리 정의된 내부 스타일을 override하여 변경
      theme={{
        /*'stylesheet.calendar.header': {
          //캘린더 헤더 스타일 변경
          header: {
            backgroundColor: 'red',
            flexDirection: 'row',
          },
        },*/
        'stylesheet.calendar.main': {
          //캘린더 전체 바디 스타일 변경
          container: {
            //backgroundColor: 'blue',
            paddingHorizontal: rsWidth * 14,
            paddingVertical: rsHeight * 20,
          },
        },
      }}
      //초기에 보이는 값, 기본값 : Date()
      //current={'2025-02-01'}

      //날짜를 눌렀을 때 처리하는 콜백 함수
      onDayPress={(day: DateData) => {
        console.log('day pressed', day);
        setSelected(day.dateString);
      }}
      //dayComponent를 override
      dayComponent={({ date, state }) => {
        console.log('datyCOmponent', date, calendarData[date.dateString]);
        return (
          state !== 'disabled' && (
            <View>
              <Text
                style={{
                  fontSize: 13 * rsFont, //WARN : 디자인 폰트가 10인데 너무 작은 것 같음
                  textAlign: 'center',
                  //1.5.7 UPDATE date.dateString 하드코딩 현재 날짜 계산으로 변경
                  color:
                    date.dateString === '2025-03-17' ? palette.primary[500] : palette.neutral[400],
                }}>
                {date.day}
              </Text>
              <TouchableOpacity
                style={{
                  width: rsWidth * 35,
                  height: rsHeight * 35,
                  //backgroundColor: 'black',
                  //backgroundColor: '#DFDFDF',
                  backgroundColor: getBackgroundColor(
                    calendarData[date.dateString]?.status || 'default_status',
                  ),
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  //console.log('state', state);
                  console.log('date', date);
                  navigation.navigate(RootStackName.HomeStackNavigator, {
                    screen: HomeStackName.SmallEmotionChart,
                    params: { dateID: date.dateString },
                  });
                  console.log('홈 화면 달력을 누름', date.dateString);
                }}>
                {calendarData[date.dateString]?.status === 'today-no-entry' ? (
                  <Icon
                    name={calendarData[date.dateString]?.status}
                    width={rsWidth * 16 + 'px'}
                    height={rsHeight * 16 + 'px'}
                  />
                ) : (
                  <Icon
                    name={calendarData[date.dateString]?.status}
                    width={rsWidth * 35 + 'px'}
                    height={rsHeight * 35 + 'px'}
                  />
                )}
              </TouchableOpacity>
            </View>
          )
        );
      }}
      // 특별한 날짜
      /*markedDates={{
          //today: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
          [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
          '2025-03-03': { selected: true },
          today: { selected: true },
        }}*/
    />
  );
};
export default CustomCalendar;
