import { instance } from './interceptor';
import { TUser } from './users.types';
import { storage } from '../utils/storageUtils';
import { NICKNAME, BIRTHDATE, GENDER } from '../constants/Constants';
//바뀐 유저의 정보를 저장하는 api
export const userEditInfo = async (profile: TUser): Promise<boolean> => {
  try {
    const res = await instance.patch('/v1/users/update-user', profile);
    //값이 있을 경우 바로 저장하고 없으면 "unknown"로 저장하기
    console.log('전달한 데이터', profile);
    storage.set(NICKNAME, profile.nickname);
    storage.set(BIRTHDATE, profile.birthdate || 'unknown');
    storage.set(GENDER, profile.gender || 'unknown');
    console.log('저장한 nickname 데이터', storage.getString(NICKNAME));
    console.log('저장한 birthdate 데이터', storage.getString(BIRTHDATE));
    console.log('저장한 gender 데이터', storage.getString(GENDER));
    return true;
  } catch (error) {
    console.log('실패. 전달한 데이터', profile);
    console.log('[ERROR] user edit info', error);
    return false;
  }
};
