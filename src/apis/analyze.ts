import {
  TDailyAnalyze,
  TDailyAnalyzeStatus,
  TEmotionCheck,
  TPeriodChart,
  TPeriodKeywords,
  TPeriodRecordEmotions,
  TPeriodTotalEmotions,
} from './analyze.type';
import { instance } from './interceptor';

//INFO : 일일 분석
export const dailyAnalyzeStatus = async (
  year: number,
): Promise<TDailyAnalyzeStatus | undefined> => {
  try {
    const res = await instance.get('/v1/analyze/daily-status', { params: { year } });
    //console.log('res.data', res.data);
    return res.data; //record, summary, classification 리턴
  } catch (error) {
    //console.log('[ERROR] daily analyze', error);
    return;
  }
};

//INFO : 일일 분석
export const dailyAnalyze = async (today: string): Promise<TDailyAnalyze | undefined> => {
  try {
    const res = await instance.get('/v1/analyze/daily', { params: { date: today } });
    return res.data; //record, summary, classification 리턴
  } catch (error) {
    //console.log('[ERROR] daily analyze', error);
    return;
  }
};

//기간 분석 : 일상 키워드 조회
export const periodKeyword = async (
  start: string,
  end: string,
): Promise<TPeriodKeywords | undefined> => {
  try {
    const res = await instance.get('/v1/analyze/period/keywords', {
      params: { start_date: start, end_date: end },
    });
    return res.data;
  } catch (error) {
    //console.log('[ERROR] period keyword', error);
    return undefined;
  }
};

//기간 분석 : 감정 탑 조회
export const periodTotalEmotion = async (
  start: string,
  end: string,
): Promise<TPeriodTotalEmotions | undefined> => {
  try {
    const res = await instance.get('/v1/analyze/period/emotions', {
      params: { start_date: start, end_date: end },
    });
    return res.data;
  } catch (error) {
    //console.log('[ERROR] period emotion', error);
    return undefined;
  }
};

//기간 분석 : 기록한 감정들 조회
export const periodRecordEmotions = async (
  start: string,
  end: string,
): Promise<TPeriodRecordEmotions | undefined> => {
  try {
    const res = await instance.get('/v1/analyze/period/records', {
      params: { start_date: start, end_date: end },
    });
    return res.data;
  } catch (error) {
    //console.log('[ERROR] period keyword', error);
    return undefined;
  }
};

/*const mockDate = {
  charts: [
    {
      category: 'anger',
      chart: [
        { date: '2025-03-05', value: 79.38144329896907 },
        { date: '2025-03-07', value: 97.9381443298969 },
      ],
    },
    {
      category: 'sadness',
      chart: [
        { date: '2025-03-05', value: 1.5463917525773194 },
        { date: '2025-03-07', value: 1.0309278350515463 },
      ],
    },
    {
      category: 'nerve',
      chart: [
        { date: '2025-03-05', value: 17.525773195876283 },
        { date: '2025-03-07', value: 1.0309278350515463 },
      ],
    },
    {
      category: 'hurt',
      chart: [
        { date: '2025-03-05', value: 1.0309278350515463 },
        { date: '2025-03-07', value: 0 },
      ],
    },
    {
      category: 'embarrassment',
      chart: [
        { date: '2025-03-05', value: 0.5154639175257731 },
        { date: '2025-03-07', value: 0 },
      ],
    },
    {
      category: 'happy',
      chart: [
        { date: '2025-03-05', value: 0 },
        { date: '2025-03-07', value: 0 },
      ],
    },
  ],
};*/

//기간 분석 : 감정 추이 조회
export const periodChart = async (
  start: string,
  end: string,
): Promise<TPeriodChart | undefined> => {
  try {
    //console.log('start_date end_date', start, end);
    const res = await instance.get('/v1/analyze/period/chart', {
      params: { start_date: start, end_date: end },
    });
    return res.data;
    /*return {
      start_date: start,
      end_date: end,
      charts: [
        {
          category: 'anger',
          chart: [
            { date: '2025-03-05', value: 79.38144329896907 },
            { date: '2025-03-07', value: 97.9381443298969 },
          ],
        },
        {
          category: 'sadness',
          chart: [
            { date: '2025-03-05', value: 1.5463917525773194 },
            { date: '2025-03-07', value: 1.0309278350515463 },
          ],
        },
        {
          category: 'nerve',
          chart: [
            { date: '2025-03-05', value: 17.525773195876283 },
            { date: '2025-03-07', value: 1.0309278350515463 },
          ],
        },
        {
          category: 'hurt',
          chart: [
            { date: '2025-03-05', value: 1.0309278350515463 },
            { date: '2025-03-07', value: 0 },
          ],
        },
        {
          category: 'embarrassment',
          chart: [
            { date: '2025-03-05', value: 0.5154639175257731 },
            { date: '2025-03-07', value: 0 },
          ],
        },
        {
          category: 'happy',
          chart: [
            { date: '2025-03-05', value: 0 },
            { date: '2025-03-07', value: 0 },
          ],
        },
      ],
    };*/
  } catch (error) {
    //console.log('[ERROR] period chart analyze', error);
    return undefined;
  }
};

//오늘의 기분 기록
export const todayEmotion = async (
  date: string,
  data: TEmotionCheck[],
  text: string,
): Promise<string[] | undefined> => {
  try {
    const myEmotions = data.map(({ keyword, group }) => ({ keyword, group }));
    const res = await instance.post('/v1/analyze/today-record', {
      date: date,
      todayFeeling: text,
      keywords: myEmotions,
    });
    return res;
  } catch (error) {
    //console.log('[ERROR] todayEmotion', error);
    return;
  }
};

//기록한 오늘의 기분 조회하기
export const todayEmotionCheck = async () => {
  try {
    const res = await instance.get('/v1/analyze/today-record');
    return res.data;
  } catch (error) {
    return;
  }
};

//연단위 - 유저 감정 일기와 키워드가 있는 날 조회 (신규 버전)
export const dailyEmotionAnalyze = async (
  year: number,
): Promise<TDailyAnalyzeStatus | undefined> => {
  try {
    const res = await instance.get('/v2/analyze/daily-status', { params: { year } });
    //console.log('res.data', res.data);
    return res.data; //id, nickname, dates 리턴
  } catch (error) {
    console.log('😀[ERROR] daily analyze', error);
    return;
  }
};
