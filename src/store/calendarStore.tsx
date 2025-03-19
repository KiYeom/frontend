import { create } from 'zustand';
import { dailyAnalyze, dailyEmotionAnalyze, periodRecordEmotions } from '../apis/analyze';
import { getMonthRange } from '../utils/times';

//날짜의 상태를 변경하는 함수
const processCalendarData = (apiData, allDates) => {
  //console.log('processCalendarDate 실행', apiData);
  //1.5.7 UPDATE 현재 날짜 가져오는 형태로 변경

  apiData.dates.forEach((date, index) => {
    const group_status = apiData.groups[index];
    //console.log('index', index);
    //console.log('group_status', group_status);
    //console.log('group_status', group_status);
    if (group_status === null) {
      allDates[date] = { status: 'normal-emotion' };
      //console.log('변경', allDates[date]);
    } else {
      allDates[date] = { status: `${group_status}-emotion` };
    }
  });

  return allDates;
};

//현재 달의 모든 날짜를 배열로 생성하는 함수
const generateAllDates = (year) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  let dates = {};

  // 0: 1월, 11: 12월
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = dateObj.toISOString().split('T')[0];

      // 날짜 비교 시, year가 today.getFullYear()와 다르면 조건을 별도로 고려해야 할 수도 있음
      if (dateStr < todayStr) {
        dates[dateStr] = { status: 'past_no_entry' };
      } else if (dateStr === todayStr) {
        dates[dateStr] = { status: 'today-no-entry' };
      } else {
        dates[dateStr] = { status: 'future_date' };
      }
    }
  }

  //console.log('generateYearDates 결과', dates);
  return dates;
};

//1.5.7 UPDATE 캘린더에서 변경하는 현재 날짜를 알아야, 그 날짜에 맞는 달을 보여줄 수 있음.
//현재는 2025 픽스라 2024 조회 안 됨...!!!
export const useCalendarStore = create((set, get) => ({
  //캘린더의 상태 정의
  calendarData: {},
  //API 호출 후 상태 저장
  fetchCalendarData: async (year: number) => {
    console.log('fetchCalendarData 실행');
    try {
      //1.5.7 UPDATE 현재 날짜 가져와서 start, end 정의하도록 설정
      //const response = await periodRecordEmotions(startDate, endDate); //1.5.7 UPDATE 새로 만든 api 확인되면 삭제하기api 를 호출하여 감정 일기 작성날을 가져옴
      const responseV2 = await dailyEmotionAnalyze(year); //1.5.7 2025 하드 코딩 변경하기
      console.log('=== responseV2', responseV2);
      //response : "records": [{"date": "2025-03-14", "keywords": [Array], "todayFeeling": "힣lgpgp"}]}
      const allDates = generateAllDates(year);
      const processData = processCalendarData(responseV2, allDates);
      set({ calendarData: processData });
    } catch (error) {
      console.log('error', error);
    }
  },
  //특정 날짜의 상태 변경
  updateEntryStatus: (date, newStatus) => {
    set((state) => ({
      calendarData: {
        ...state.calendarData,
        [date]: { status: newStatus },
      },
    }));
  },
  logCalendarState: () => {
    console.log('현재 캘린더 상태', get().calendarData);
  },
}));
