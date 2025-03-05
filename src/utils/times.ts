export const KOREA_TIMEOFFSET_MINUTES = +9 * 60;
export const START_HOUR = 6;

//checked at 24-11-25
export const getKoreanRealDateString = (date: Date = new Date()): string => {
  const nowKoreanDate = new Date(date.getTime() + KOREA_TIMEOFFSET_MINUTES * 60 * 1000);

  return (
    nowKoreanDate.getUTCFullYear() +
    '-' +
    String(nowKoreanDate.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(nowKoreanDate.getUTCDate()).padStart(2, '0')
  );
};

//checked at 24-11-25
/*
현재 대한민국의 시간을 reMIND 서버 시간으로 변경하여, yyyy-mm-dd 형태의 string으로 리턴하는 getKoreanServerTodayDateString 함수
- 한국에서 3월 4일 새벽 6시는 리마인드 시계로는 3월 4일이 딱 되는 시작
- 한국에서 3월 5일 새벽 5시 59분은 라마인드 시계로는 3월 4일에서 5일로 넘어가기 직전

내가 3월 5일 낮 4시에 쿠키랑 대화를 했다고 하면, 리마인드 시계로는 3월 5일...?

*/
export const getKoreanServerTodayDateString = (date: Date): string => {
  const nowKoreanTimeByUTC = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  if (nowKoreanTimeByUTC.getUTCHours() < 6) {
    nowKoreanTimeByUTC.setUTCDate(nowKoreanTimeByUTC.getUTCDate() - 1);
  }

  const result =
    nowKoreanTimeByUTC.getUTCFullYear() +
    '-' +
    String(nowKoreanTimeByUTC.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(nowKoreanTimeByUTC.getUTCDate()).padStart(2, '0');

  console.log('KoreanServerTodayDate: ' + result);

  return result;
};

//checked at 24-11-25
export const getKoreanServerYesterdayDateString = (testDate: Date): string => {
  const nowKoreanTimeByUTC = new Date(testDate.getTime() + 9 * 60 * 60 * 1000);

  if (nowKoreanTimeByUTC.getUTCHours() < 6) {
    nowKoreanTimeByUTC.setUTCDate(nowKoreanTimeByUTC.getUTCDate() - 1);
  }

  nowKoreanTimeByUTC.setUTCDate(nowKoreanTimeByUTC.getUTCDate() - 1);

  const result =
    nowKoreanTimeByUTC.getUTCFullYear() +
    '-' +
    String(nowKoreanTimeByUTC.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(nowKoreanTimeByUTC.getUTCDate()).padStart(2, '0');

  console.log('result: ' + result);

  return result;
};
