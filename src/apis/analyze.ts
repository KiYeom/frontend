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
