import { create } from 'zustand';
import { dailyAnalyze, dailyEmotionAnalyze, periodRecordEmotions } from '../apis/analyze';

type fetchCalendarData = {
  date: string; //일기를 작성한 날짜
  keywords: string[]; //감정 일기 키워드
  todayFeeling: string; //감정 일기 내용
};

/*
날짜의 상태
1. 과거의 날짜인데
  - 작성 이력이 없는 날 : past_no_entry
  - 네 가지 감정 중 하나가 작성된 날 past_with_emotion
  >>> 'angry' | 'sad' | 'happy' | 'calm';
2. 현재의 날짜인데
  - 작성 이력이 없는 날 today_no_entry
  - 네 가지 감정 중 하나가 작성된 날 today_with_emotion
  - 채팅을 하였지만, 감정은 분석이 안 된 날 today_no_emotion_analysis
3. 미래의 날짜 future_date


[1] 앱을 실행하면, 현재 날짜의 달의 모든 정보를 받아온다. (기간 리포트 api)
[2] 정보에 따라 날짜의 상태를 구분한다.
[3] 구분한 날짜의 상태대로 화면에 그린다.
*/

//날짜의 상태를 변경하는 함수
const processCalendarData = (apiData, allDates) => {
  console.log('processCalendarDate 실행', apiData);
  //1.5.7 UPDATE 현재 날짜 가져오는 형태로 변경
  const today = '2025-03-17';
  //console.log('_________apiData', apiData);
  //console.log('_________apiData', apiData.dates);
  //console.log('_________apiData', apiData.groups);
  /*apiData.forEach((item) => {
    console.log('item', item);
    const date = item.dates;
    const group_status = item.groups;
    console.log('------- 2️⃣ date, group_status', date, group_status);

    allDates[date] = { status: `${group_status}-emotion` };
    console.log('allDates[date]', allDates[date]);
  });*/
  //console.log('processCalendarData 결과', allDates);

  apiData.dates.forEach((date, index) => {
    const group_status = apiData.groups[index];

    allDates[date] = { status: `${group_status}-emotion` };
  });

  return allDates;
};

//현재 달의 모든 날짜를 배열로 생성하는 함수
const generateAllDates = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let dates: any = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day).toISOString().split('T')[0];
    if (date < today.toISOString().split('T')[0]) {
      dates[date] = { status: 'past_no_entry' };
    } else if (date === today.toISOString().split('T')[0]) {
      dates[date] = { status: 'today-no-entry' };
    } else {
      dates[date] = { status: 'future_date' };
    }
  }
  console.log('generateAllDates 결과', dates);
  return dates;
};

export const useCalendarStore = create((set, get) => ({
  //캘린더의 상태 정의
  calendarData: {},
  //API 호출 후 상태 저장
  fetchCalendarData: async () => {
    console.log('fetchCalendarData 실행');
    try {
      //1.5.7 UPDATE 현재 날짜 가져와서 start, end 정의하도록 설정
      const startDate = '2025-03-01';
      const endDate = '2025-03-31';
      //const response = await periodRecordEmotions(startDate, endDate); //1.5.7 UPDATE 새로 만든 api 확인되면 삭제하기api 를 호출하여 감정 일기 작성날을 가져옴
      const responseV2 = await dailyEmotionAnalyze(2025); //1.5.7 2025 하드 코딩 변경하기
      console.log('=== responseV2', responseV2);
      //response : "records": [{"date": "2025-03-14", "keywords": [Array], "todayFeeling": "힣lgpgp"}]}
      const allDates = generateAllDates();
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
