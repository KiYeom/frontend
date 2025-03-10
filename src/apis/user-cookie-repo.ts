import { instance } from './interceptor';

type TCookieRepoInfo = {
  totalChats: number;
  totalDays: number;
};

//회원 탈퇴 정보 가져오기
export const cookieRepoInfo = async (): Promise<TCookieRepoInfo | undefined> => {
  try {
    const res = await instance.get('/v1/users/defend');
    return res.data;
  } catch (error) {
    //console.log('[ERROR] cookieRepoInfo', error);
    return;
  }
};
