import { ACCESSTOKEN, REFRESHTOKEN, USER } from '../constants/Constants';
import { storage } from './storageUtils';
import axios from 'axios';

//구글 회원가입하기
const googleSignUp = async (setIsSignIn: any) => {
  console.log('googleSignUp 함수 동작!');
  axios
    .post('https://api.remind4u.co.kr/v1/auth/google-signup', {
      nickname: USER.NICKNAME,
      gender: USER.GENDER,
      accessToken: USER.GOOGLEACCTOKEN,
      birthdate: USER.BIRTHDATE,
      deviceId: USER.DEVICEID,
      appVersion: USER.APPVERSION,
      deviceOs: USER.DEVICEOS,
    })
    .then(function (response) {
      signUpSuccess(response, setIsSignIn);
    })
    .catch(function (error) {
      signUpFail(error);
    });
};

//애플 회원가입하기
const appleSignUp = async (setIsSignIn: any) => {
  console.log('appleSignUp 함수 동작!');
  axios
    .post('https://api.remind4u.co.kr/v1/auth/apple-signup', {
      nickname: USER.NICKNAME,
      gender: USER.GENDER,
      authCode: USER.AUTHCODE,
      idToken: USER.IDTOKEN,
      birthdate: USER.BIRTHDATE,
      deviceId: USER.DEVICEID,
      appVersion: USER.APPVERSION,
      deviceOs: USER.DEVICEOS,
    })
    .then(function (response) {
      signUpSuccess(response, setIsSignIn);
    })
    .catch(function (error) {
      signUpFail(error);
    });
};

//회원가입을 성공했을 때 함수
//회원가입에 성공하면 토큰을 디바이스에 저장하고
const signUpSuccess = (response: any, setIsSignIn: any) => {
  console.log('회원가입 성공', response);
  storage.set(ACCESSTOKEN, response.data.data.accessToken);
  storage.set(REFRESHTOKEN, response.data.data.refreshToken);
  console.log('회원가입 성공 refreshtoken : ', response.data.data.refreshToken);
  setIsSignIn(true); //tabbar로 이동
  //console.log('======= ', isButtonDisabled);
};

//회원가입을 실패했을 때 함수
//회원가입에 실패하게 되면 콘솔에 찍히고 회원가입 실패 모달창이 나온다.
const signUpFail = (error: any) => {
  console.log('회원가입 실패 error(data): ', error.response.data);
  console.log('회원가입 실패 error(stats)', error.response.status);
  console.log('회원가입 실패 error(headers)', error.response.headers);
  //console.log('======= ', isButtonDisabled);
};

export { googleSignUp, appleSignUp, signUpSuccess, signUpFail };
