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
