import { instance } from './interceptor';
import {
  TDailyAnalyze,
  TPeriodChart,
  TPeriodKeywords,
  TEmotions,
  TEmotionCheck,
} from './analyze.type';

//INFO : 일일 분석
export const dailyAnalyze = async (today: string): Promise<TDailyAnalyze | undefined> => {
  try {
    console.log('today', today);
    const res = await instance.get('/v1/analyze/daily', { params: { date: today } });
    return res.data; //record, summary, classification 리턴
  } catch (error) {
    console.log('[ERROR] daily analyze', error);
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
    console.log('[ERROR] period keyword', error);
    return undefined;
  }
};

//기간 분석 : 감정 추이 조회
export const periodChart = async (
  start: string,
  end: string,
): Promise<TPeriodChart | undefined> => {
  try {
    const res = await instance.get('/v1/analyze/period/chart', {
      params: { start_date: start, end_date: end },
    });
    return res.data;
  } catch (error) {
    console.log('[ERROR] period chart analyze', error);
    return undefined;
  }
};

//오늘의 기분 기록
export const todayEmotion = async (data: TEmotionCheck[]): Promise<string[] | undefined> => {
  try {
    const myEmotions = data.map(({ keyword, group }) => ({ keyword, group }));
    const res = await instance.post('/v1/analyze/today-record', {
      keywords: myEmotions,
    });
    return res;
  } catch (error) {
    console.log('[ERROR] todayEmotion', error);
    return;
  }
};

//기록한 오늘의 기분 조회하기
export const todayEmotionCheck = async () => {
  try {
    const res = await instance.get('/v1/analyze/today-record');
    console.log('기분 조회하기', res);
    return res.data;
  } catch {
    console.log('기록한 오늘의 기분 error', error);
    return;
  }
};
