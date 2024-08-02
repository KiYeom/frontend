import { instance } from './interceptor';
import { TUser } from './users.types';

//설정 화면을 눌렀을 때 유저의 정보를 가지고 오는 getUserInfo 함수
export const getUserInfo = async (): Promise<TUser | false> => {
  console.log('유저의 정보를 가지고 오는 get api 요청하기');
  try {
    const res = await instance.get('/users/me');
    console.log('[SUCCESS] getUserInfo function complete', res.data);
    return res.data;
  } catch (error) {
    console.error('[ERROR] gerUserInfo function error', error);
    return false;
  }
};
