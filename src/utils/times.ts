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

  //console.log('KoreanServerTodayDate: ' + result);

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

  //console.log('result: ' + result);

  return result;
};

//오늘의 날짜를 가지고 오는 getDate 함수
export const getDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const monthIndex = today.getMonth(); //0~11 month 값
  const month = (monthIndex + 1).toString().padStart(2, '0'); //2월이면 02월로

  const day = today.getDate().toString().padStart(2, '0'); //1일일면 01일로

  const dateString = year + '-' + month + '-' + day; // 2023-06-18

  return dateString;
};

//시작 날짜와 끝 날짜를 가지고 오는 함수
export const getMonthRange = (): { start: string; end: string } => {
  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth(); // 0부터 시작하는 인덱스
  const month = (monthIndex + 1).toString().padStart(2, '0');

  // 해당 달의 시작일 (항상 01일)
  const start = `${year}-${month}-01`;

  // 해당 달의 마지막 일자 계산: 다음 달 0일은 이번 달의 마지막 날
  const lastDay = new Date(year, monthIndex + 1, 0).getDate().toString().padStart(2, '0');
  const end = `${year}-${month}-${lastDay}`;

  return { start, end };
};

// 예시 출력
//console.log(getMonthRange());
// 만약 오늘이 2025-03-16이면 { start: "2025-03-01", end: "2025-03-31" } 를 반환합니다.

export const formatDateKorean = (dateStr: string): string => {
  // '2025-03-01' 형태를 '-'로 분리합니다.
  const [year, month, day] = dateStr.split('-');
  // 앞의 0을 제거하기 위해 정수형으로 변환
  const monthNumber = parseInt(month, 10);
  const dayNumber = parseInt(day, 10);
  return `${year}년 ${monthNumber}월 ${dayNumber}일`;
};

export const convertUtcToKst = (dateStr: string): string => {
  const date = new Date(dateStr);
  date.setUTCHours(date.getUTCHours() + 9); // UTC 시간에 9시간 추가 (KST 변환)
  return `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;
};
