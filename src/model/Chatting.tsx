import axios from "axios";
import { storage } from "../../utils/storageUtils";
import { REFRESHTOKEN, USER, ACCESSTOKEN } from "../constants/Constants";
// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://34.125.112.144:8000', // API의 기본 URL
  headers: {
    'Content-Type': 'application/json', // 기본 Content-Type 헤더 설정
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  function (config) {
    // 요청이 전달되기 전에 작업 수행
    const token = storage.getString(ACCESSTOKEN);// 로컬 스토리지에서 액세스 토큰 가져오기
    console.log("요청 인터셉터 token ", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    return config; // 수정된 요청 반환
  },
  function (error) {
    // 요청 오류가 있는 경우 작업 수행
    return Promise.reject(error); // 오류를 그대로 반환
  }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  function (response) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행
    return response; // 응답을 그대로 반환
  },
  async function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    const originalRequest = error.config; // 원래 요청 저장

    if (error.response.status === 401 && !originalRequest._retry) {
      // 토큰 만료 오류 감지 및 재발급 로직
      originalRequest._retry = true; // 무한 루프 방지를 위해 _retry 플래그 설정

      try {
        const refreshToken = storage.getString(REFRESHTOKEN); // 리프레시 토큰 가져오기
        const response = await axiosInstance.post('/api/v1/auth/refresh', {
          deviceId: USER.DEVICEID,
          appVersion: USER.APPVERSION,
          deviceOs: USER.DEVICEOS,
          refreshToken: storage.getString(REFRESHTOKEN),
          requireUserInfo: true,
        });

        if (response.status === 200) {
          // 새로운 액세스 토큰을 성공적으로 받았을 때
          storage.set(ACCESSTOKEN, response.data.accessToken); // 새로운 액세스 토큰을 로컬 스토리지에 저장

          // 원래 요청의 Authorization 헤더를 새로운 토큰으로 업데이트
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

          // 원래 요청을 새 토큰으로 다시 시도
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 처리
        console.error('토큰 갱신 실패:', refreshError); // 콘솔에 오류 출력
        // 필요에 따라 로그아웃 처리 등 추가 작업 수행 가능
      }
    }

    return Promise.reject(error); // 오류를 그대로 반환
  }
);

export default axiosInstance; // 수정된 Axios 인스턴스 내보내기

