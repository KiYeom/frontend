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
const generateAllDates = (year: number) => {
  //const today = new Date();
  //const todayStr = today.toISOString().split('T')[0];
  //console.log('+++++++++', todayStr);

  const today = new Date();

  // 현재 시간을 UTC 기준 타임스탬프로 변환한 후, 한국 시간(UTC+9) 오프셋을 적용
  const utc = today.getTime() + today.getTimezoneOffset() * 60000;
  const todayKorean = new Date(utc + 9 * 60 * 60000);

  // 한국 시간 기준 연/월/일 추출
  const today_year = todayKorean.getFullYear();
  const today_month = String(todayKorean.getMonth() + 1).padStart(2, '0');
  const today_day = String(todayKorean.getDate()).padStart(2, '0');
  const todayStr = `${today_year}-${today_month}-${today_day}`;

  //console.log('~~~~~~~~todayStr~~~~~~~~', todayStr);

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

// ---- 캘린더 스토어 ---- //

// 캘린더 날짜 객체 타입
export interface CalendarDate {
  status: string;
}

// 캘린더 전체 데이터 타입
export type CalendarData = Record<string, CalendarDate>;

// zustand 스토어 인터페이스
interface CalendarStore {
  calendarData: CalendarData;
  fetchCalendarData: (year: number) => Promise<void>;
  updateEntryStatus: (date: string, newStatus: string) => void;
  logCalendarState: () => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  //캘린더의 상태 정의
  calendarData: {},
  //API 호출 후 상태 저장
  fetchCalendarData: async (year: number) => {
    console.log('fetchCalendarData 실행');
    try {
      //1.5.7 UPDATE 현재 날짜 가져와서 start, end 정의하도록 설정
      //const response = await periodRecordEmotions(startDate, endDate); //1.5.7 UPDATE 새로 만든 api 확인되면 삭제하기api 를 호출하여 감정 일기 작성날을 가져옴
      //console.log('year', year);
      const responseV2 = await dailyEmotionAnalyze(year);
      //console.log('=== responseV2', responseV2);
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
    console.log('date ', date);
    console.log('newStatus ', newStatus);
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
