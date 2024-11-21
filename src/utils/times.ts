export const KOREA_TIMEOFFSET_MINUTES = +9 * 60;
export const START_HOUR = 6;

export const getIsoString = (date: Date, timezoneOffsetMinute = KOREA_TIMEOFFSET_MINUTES) => {
  const tzo = timezoneOffsetMinute,
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num: number) {
      return (num < 10 ? '0' : '') + num;
    };

  // UTC 시간에서 오프셋을 적용한 시간을 계산합니다.
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const localDate = new Date(utc + timezoneOffsetMinute * 60000);

  return (
    localDate.getFullYear() +
    '-' +
    pad(localDate.getMonth() + 1) +
    '-' +
    pad(localDate.getDate()) +
    'T' +
    pad(localDate.getHours()) +
    ':' +
    pad(localDate.getMinutes()) +
    ':' +
    pad(localDate.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' +
    pad(Math.abs(tzo) % 60)
  );
};

export const getApiDateString = (date: Date = new Date()): string => {
  const nowKoreanDate = new Date(date.getTime() + KOREA_TIMEOFFSET_MINUTES * 60 * 1000);

  if (nowKoreanDate.getHours() < START_HOUR) {
    nowKoreanDate.setDate(nowKoreanDate.getDate() - 1);
  }
  return (
    nowKoreanDate.getUTCFullYear() +
    '-' +
    String(nowKoreanDate.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(nowKoreanDate.getUTCDate()).padStart(2, '0')
  );
};
