import { instance } from './interceptor';
import { setUserInfo, storage } from '../utils/storageUtils';
import { TGender } from '../constants/types';
import { TDisplayUserInfo, TUserInfo } from './setting.types';
//바뀐 유저의 정보를 저장하는 api

export const userEditInfo = async (
  profile: TDisplayUserInfo,
): Promise<TDisplayUserInfo | undefined> => {
  try {
    const res = await instance.patch('/v1/users/update-user', profile);
    return res.data;
  } catch (error) {
    console.log('[ERROR] user edit info', error);
    return;
  }
};
