import { instance } from './interceptor';
import { AnalyzeResult } from './analyze.type';

//INFO : 일일 분석
export const dailyAnalyze = async (today: string): Promise<AnalyzeResult | undefined> => {
  try {
    console.log('today', today);
    const res = await instance.get('/v1/analyze/daily', { params: { date: today } });
    console.log('res!', res.data);
    return res.data; //record, summary, classification 리턴
  } catch (error) {
    console.log('[ERROR] daily analyze', error);
    return;
  }
};

//기간 분석 : 나의 일상 토픽
export const periodAnalyze = async (
  start: string,
  end: string,
): Promise<AnalyzeResult | undefined> => {
  try {
    console.log('period 호출됨', start, end);
    const res = await instance.get('/v1/analyze/period/keywords', {
      params: { start_date: start, end_date: end },
    });
    console.log('periodAnalyze', res.data);
    return res.data;
  } catch (error) {
    console.log('[ERROR] period analyze', error);
    return undefined;
  }
};
