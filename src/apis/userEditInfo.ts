import { instance } from './interceptor';
import { TUser } from './users.types';
export const userEditInfo = async (profile: TUser): Promise<boolean> => {
  try {
    //유저의 변경 정보를 db에 보내주는 api. api 수정해야 함
    const res = await instance.patch('/users/nickname', profile);
    return true;
  } catch (error) {
    console.log('[ERROR] user edit info', error);
    return false;
  }
};
