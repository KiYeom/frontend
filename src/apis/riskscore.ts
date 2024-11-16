import { getIsScoreDemo } from '../utils/storageUtils';
import { instance } from './interceptor';
import { TDangerButtonRes } from './risk-score.types';

export const getRiskScore = async (today: string): Promise<number> => {
  try {
    if (getIsScoreDemo()) return 99;
    const res = await instance.get('/v1/analyze/daily/score', {
      params: { date: today },
    });
    if (!res.data.score || res.data.score < 0 || res.data.score > 100) {
      return 0;
    }

    return res.data.score;
  } catch (error) {
    console.error('[ERROR] getRiskScore function error', error);
    return 0;
  }
};

export const getDangerButtons = async (): Promise<TDangerButtonRes | undefined> => {
  try {
    const res = await instance.get('/v1/users/danger-buttons');
    return res.data;
  } catch (error) {
    console.error('[ERROR] getDangerButtons function error', error);
    return undefined;
  }
};
