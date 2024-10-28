import { instance } from './interceptor';
export const getRiskScore = async (today: string): Promise<number> => {
  try {
    const res = await instance.get('/v1/analyze/daily/score', {
      params: { date: today },
    });
    if (res.data.score === null) {
      return 0;
    }
    return res.data.score;
  } catch (error) {
    console.error('[ERROR] getRiskScore function error', error);
    return;
  }
};
