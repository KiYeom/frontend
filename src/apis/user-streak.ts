import * as Sentry from '@sentry/react-native';
import { instance } from './interceptor';
import { TUserDiaryStreak } from './user-streak.types';

export const getUserDiaryStreak = async (): Promise<TUserDiaryStreak | undefined> => {
  try {
    const res = await instance.get('/v2/analyze/user-streak');
    return res.data;
  } catch (error) {
    console.log('error getUserDiaryStreak');
    Sentry.captureException(error); // Sentry에 에러 전송
    return;
  }
};
