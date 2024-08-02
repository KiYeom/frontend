import { storage } from './storageUtils';
import { ACCESSTOKEN, REFRESHTOKEN, USER } from '../constants/Constants';
import { NICKNAME, BIRTHDATE, GENDER } from '../constants/Constants';
//로그인 성공 시 실행하는 함수
//소셜로그인에 성공한 경우 (= 가입한 적이 있는 유저) 서버는 토큰을 클라이언트에게 발급
//발급한 토큰을 클라이언트는 storage에 key-value로 저장
//signin이 true -> home 화면으로 이동
const handleLoginResponse = (response: any) => {
  console.log('handleLoginResponse 함수 실행');
  storage.set(ACCESSTOKEN, response.data.data.accessToken); //access token을 storage에 저장
  storage.set(REFRESHTOKEN, response.data.data.refreshToken); //refresh token을 storage에 저장
  USER.NICKNAME = response.data.data.nickname;
  USER.BIRTHDATE = response.data.data.birthdate;
  USER.GENDER = response.data.data.gender;
  storage.set(NICKNAME, response.data.data.nickname);
  storage.set(BIRTHDATE, response.data.data.birthDate);
  storage.set(GENDER, response.data.data.gender);
  console.log('로그인 성공. 로그인을 위해 전달한 데이터 : ', response);
};

//로그인 실패 시 실행하는 함수
//소셜로그인에 실패한 경우에 싪행되며
//가입한 적이 없을 경우 (404) 회원가입 페이지로 이동
const handleLoginError = (error: any, navigation: any) => {
  console.log('handleLoginError 함수 실행');
  if (error.response.status === 404) {
    //새로운 유저이므로 회원가입 진행
    navigation.navigate('SignUpStackNavigator', { screen: 'InfoName' });
  } else {
    //그 외의 에러 발생한 경우
    console.log('로그인 실패');
    console.log(error);
  }
};
export { handleLoginResponse, handleLoginError };
