export const KOREA_TIMEOFFSET_MINUTES = +9 * 60;
export const START_HOUR = 6;

export const getKoreanDateString = (date: Date = new Date()): string => {
  const nowKoreanDate = new Date(date.getTime() + KOREA_TIMEOFFSET_MINUTES * 60 * 1000);

  return (
    nowKoreanDate.getUTCFullYear() +
    '-' +
    String(nowKoreanDate.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(nowKoreanDate.getUTCDate()).padStart(2, '0')
  );
};

export const getApiDateString = (date: Date = new Date()): string => {
  const nowKoreanDate = new Date(date.getTime() + KOREA_TIMEOFFSET_MINUTES * 60 * 1000);

  console.log(
    'apiDateString: ' +
      nowKoreanDate.getUTCFullYear() +
      '-' +
      String(nowKoreanDate.getUTCMonth() + 1).padStart(2, '0') +
      '-' +
      String(nowKoreanDate.getUTCDate()).padStart(2, '0'),
  );

  return (
    nowKoreanDate.getUTCFullYear() +
    '-' +
    String(nowKoreanDate.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(nowKoreanDate.getUTCDate()).padStart(2, '0')
  );
};
