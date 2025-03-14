import { setLogLevel } from '@react-native-firebase/app';
import react, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, CalendarList, Agenda, DateData, LocaleConfig } from 'react-native-calendars';
import { rsHeight, rsWidth, rsFont } from '../../utils/responsive-size';
import Icon from '../icons/icons';
import palette from '../../assets/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { HomeStackName, RootStackName } from '../../../src/constants/Constants';

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

const CustomCalendar = ({ navigation }) => {
  const [selected, setSelected] = useState<string>('');
  const [today, setToday] = useState<string>('');
  useEffect(() => {
    //console.log('date, ', new Date().toISOString().split('T')[0]);
    setToday(new Date().toISOString().split('T')[0]);
  }, []);
  return (
    <Calendar
      style={{
        borderWidth: 1,
        borderColor: 'gray',
        height: rsHeight * 410,
        width: rsWidth * 350,
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
        return (
          state !== 'disabled' && (
            <View>
              <Text
                style={{
                  fontSize: 13 * rsFont, //WARN : 디자인 폰트가 10인데 너무 작은 것 같음
                  textAlign: 'center',
                  color: state === 'disabled' ? palette.neutral[50] : palette.neutral[400],
                }}>
                {date.day}
              </Text>
              <TouchableOpacity
                style={{
                  width: rsWidth * 28,
                  height: rsHeight * 28,
                  backgroundColor: '#DFDFDF',
                  borderRadius: 50,
                }}
                onPress={() => {
                  //console.log('state', state);
                  console.log('date', date);
                  navigation.navigate(RootStackName.HomeStackNavigator, {
                    screen: HomeStackName.SmallEmotionChart,
                    params: { date: date.dateString },
                  });
                }}></TouchableOpacity>
            </View>
          )
        );
      }}
      // 특별한 날짜
      markedDates={{
        //today: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
        [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
        '2025-03-03': { selected: true },
        today: { selected: true },
      }}
    />
  );
};
export default CustomCalendar;
