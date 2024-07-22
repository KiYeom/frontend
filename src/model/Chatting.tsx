import axios from "axios";
import { storage } from "../../utils/storageUtils";
import { REFRESHTOKEN, USER, ACCESSTOKEN } from "../constants/Constants";
import useChatBtnState from "../store/chatBtnState";
//const {chatDisable, setChatDisable} = useChatBtnState();

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'https://api.remind4u.co.kr/v1', // API의 기본 URL
  headers: {
    'Content-Type': 'application/json', // 기본 Content-Type 헤더 설정
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  function (config) {
    const token = storage.getString(ACCESSTOKEN); // 로컬 스토리지에서 액세스 토큰 가져오기
    console.log("요청 인터셉터 token: ", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    console.log("요청 인터셉터 config: ", config);
    return config; // 수정된 요청 반환
  },
  function (error:any) {
    console.log("요청 인터셉터 오류: ", error);
    console.log("요청 인터셉터 오류남 json", JSON.parse(error.toString()))
    return Promise.reject(error); // 오류를 그대로 반환 
  }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  function (response) {
    console.log("응답 인터셉터 응답: ", response);
    return response; // 응답을 그대로 반환
  },
  async function (error) {
    console.log("응답 인터셉터 오류: ", error);
    console.log("응답 인터셉터 안 됨 json", error)
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getString(REFRESHTOKEN); // 리프레시 토큰 가져오기
        console.log("리프레시 토큰: ", refreshToken);

        if (!refreshToken) {
          console.error("리프레시 토큰이 없습니다.");
          return Promise.reject(error);
        }

        const response = await axios({
          method: 'patch',
          url: 'https://api.remind4u.co.kr/v1/auth/refresh',
          data: {
            deviceId: USER.DEVICEID,
            appVersion: USER.APPVERSION,
            deviceOs: USER.DEVICEOS,
            refreshToken: refreshToken,
            isAppStart: false, //재발급 할 때는 x
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          console.log("response 살펴보기", response);
          console.log("ddd", response.data);
          console.log("새로운 액세스 토큰 수신: ", response.data.data.accessToken);
          storage.set(ACCESSTOKEN, response.data.data.accessToken);

          originalRequest.headers['Authorization'] = `Bearer ${response.data.data.accessToken}`;

          return axiosInstance(originalRequest);
        }
      } catch (refreshError:any) {
        console.log("토큰 자동 갱신 안 됨 json", refreshError)
        console.error('토큰 갱신 실패: ', refreshError);
        console.error('토큰 갱신 실패 - 상세 정보: ', {
          message: refreshError.message,
          config: refreshError.config,
          code: refreshError.code,
          request: refreshError.request,
          response: refreshError.response ? {
            status: refreshError.response.status,
            data: refreshError.response.data,
            headers: refreshError.response.headers,
          } : null,
        }); // 콘솔에 오류 출력
      }
    }

    return Promise.reject(error); // 오류를 그대로 반환
  }
);

export default axiosInstance;