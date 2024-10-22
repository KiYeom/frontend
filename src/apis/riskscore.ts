import { instance } from './interceptor';
export const getRiskScore = async (today: string): Promise<number> => {
  console.log('위험 점수 가져오가');
  try {
    const res = await instance.get('/v1/analyze/daily/score', {
      params: { date: today },
    });
    console.log('위험점수 가져옴', res.data);
    if (res.data.score === null) {
      console.log('점수 없음');
      return 0;
    }
    return res.data;
  } catch (error) {
    console.error('[ERROR] getRiskScore function error', error);
    return;
  }
};
