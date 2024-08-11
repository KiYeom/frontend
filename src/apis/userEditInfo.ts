import { instance } from './interceptor';
import { TDisplayUserInfo } from './setting.types';
//바뀐 유저의 정보를 저장하는 api

export const userEditInfo = async (
  profile: TDisplayUserInfo,
): Promise<TDisplayUserInfo | undefined> => {
  try {
    const res = await instance.patch('/v1/users/update-user', profile);
    return res.data;
  } catch (error) {
    console.error('[ERROR] user edit info', error);
    return undefined;
  }
};
