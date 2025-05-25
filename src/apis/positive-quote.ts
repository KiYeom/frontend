import { instance } from './interceptor';
import { TGetUserCanOpenQuote, TUpdateUserCanOpenQuote } from './positive-quote.type';

//오늘 열어본 적이 없다면 true, 오늘 이미 열어봤다면 false
export const getUserCanOpenQuote = async (): Promise<TGetUserCanOpenQuote | undefined> => {
  try {
    const res = await instance.get('/v1/users/cookie/can-open');
    return res.data;
  } catch (error) {
    console.error('[ERROR] getUserCanOpenQuote function error', error);
    return;
  }
};

export const updateUserCanOpenQuote = async (): Promise<TUpdateUserCanOpenQuote | undefined> => {
  try {
    const res = await instance.patch('/v1/users/cookie');
    console.log('updateUserCanOpenQuote(최초로 열어본 날짜)', res.data);
    return res.data;
  } catch (error) {
    console.error('[ERROR] updateUserCanOpenQuote function error', error);
    return;
  }
};
