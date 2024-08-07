import { Dimensions, Platform } from 'react-native';
export const basicDimensions = {
  height: 844,
  width: 390,
}; //기준이 되는 화면 크기 (디자인 할 때 화면 크기)

export const ratio = Platform.OS === 'android' ? 0.9 : 1;
//비율 : 안드로이드는 0.9, 아이폰은 1

//반응형 크기 비율 계산하기 (reHeight = 실기기 높이 / 디자인 높이 [비율])
export const rsHeight = parseFloat(
  (Dimensions.get('screen').height * (1 / basicDimensions.height)).toFixed(2),
);
//반응형 크기 비율 계산하기 (rsWidth = 실기기 너비 / 디자인 너비 [비율])
export const rsWidth = parseFloat(
  (Dimensions.get('screen').width * (1 / basicDimensions.width)).toFixed(2),
);
//반응형 크기 비율 계산하기 (reFont = 실기기 너비 / 디자인 너비 * 0.9)
export const rsFont = parseFloat(
  (Dimensions.get('screen').width * (0.9 / basicDimensions.width)).toFixed(2),
);
