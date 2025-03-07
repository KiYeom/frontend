import { getIsScoreDemo } from '../utils/storageUtils';
import { instance } from './interceptor';
import { TDangerButtonRes } from './risk-score.types';

/*
getRiskScore
오늘의 위험 점수를 get요청으로 가지고 오는 함수. date 파라미터가 api에 전달됨
날짜는 yyyy-mm-dd 형태로 전달해주어야 함
return : number (위험 점수 0  ~ 100)
*/
export const getRiskScore = async (today: string): Promise<number> => {
  console.log('getRiskScore 실행됨');
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
