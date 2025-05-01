import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// Constants.expoConfig.extra에서 환경 변수 가져오기
const { APP_ENV } = Constants.expoConfig?.extra || {};

// 환경 확인
const isProduction = APP_ENV === 'production';
const isStaging = APP_ENV === 'staging';
const isDevelopment = APP_ENV === 'development' || !APP_ENV; // APP_ENV가 없으면 개발 환경으로 간주

/*console.log('환경 확인', {
  isProduction,
  isStaging,
  isDevelopment,
});*/

// 플랫폼별, 환경별 광고 ID 유틸리티
const getAdUnitId = (androidProductionId, iosProductionId) => {
  // 개발/스테이징 환경이면 테스트 ID 사용
  /*if (!isProduction) {
    console.log('테스트 광고 ID 사용', TestIds.REWARDED);
    return TestIds.REWARDED;
  }*/

  // 프로덕션이면 플랫폼에 맞는 실제 ID 사용
  return Platform.OS === 'ios' ? iosProductionId : androidProductionId;
};

export default {
  environment: APP_ENV || 'development',
  isProduction,
  isStaging,
  isDevelopment,
  getAdUnitId,
};
