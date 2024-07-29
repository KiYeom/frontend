import { instance } from './interceptor';
import { TUser } from './users.types';

//INFO: 회원가입
export const updateUserProfile = async (profile: TUser): Promise<boolean> => {
  try {
    const res = await instance.patch('/users/update-new-user', profile);
    return res.data;
  } catch (error) {
    console.error('[ERROR] updateUserProfile', error);
    return false;
  }
};
