import { setLogLevel } from '@react-native-firebase/app';
import react, { useState, useEffect } from 'react';
import { Calendar, CalendarList, Agenda, DateData, LocaleConfig } from 'react-native-calendars';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
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

const CustomCalendar = () => {
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
        height: rsHeight * 398,
        width: rsWidth * 350,
      }}
      //초기에 보이는 값, 기본값 : Date()
      //current={'2025-02-01'}

      //날짜를 눌렀을 때 처리하는 콜백 함수
      onDayPress={(day: DateData) => {
        console.log('day pressed', day);
        setSelected(day.dateString);
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
