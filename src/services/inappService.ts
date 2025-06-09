import Purchases, { PurchasesPackage, PurchasesOffering } from 'react-native-purchases';
import { Alert, Platform } from 'react-native';

const APIKeys = {
  apple: 'appl_fPMYhWqdXgEZtsFvoDpuZlklJSV',
  google: 'your_revenuecat_google_api_key',
};

export const initializeInApp = async () => {
  if (Platform.OS === 'android') {
    await Purchases.configure({ apiKey: APIKeys.google });
  } else {
    await Purchases.configure({ apiKey: APIKeys.apple });
  }
  Purchases.setDebugLogsEnabled(true);
};

export const getCurrentOffering = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
};

//구매 상태 갱신
export const updatePurchaseStatus = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log('고객 정보', customerInfo.entitlements.active['emoji_v1_unlock']);
    return Object.keys(customerInfo.entitlements.active).length > 0;
  } catch (e) {
    console.warn('고객 정보 조회 오류:', e);
    return false;
  }
};

//구매 버튼 클릭 시, 구매를 시도하는 함수
export const purchasePackage = async (pkg: PurchasesPackage, hasPurchased: boolean) => {
  console.log('구매 시도:', pkg.product.identifier);
  if (hasPurchased) {
    Alert.alert('알림', '이미 구매한 상품입니다.');
    return false;
  }
  try {
    const purchaseResult = await Purchases.purchasePackage(pkg);
    console.log('구매 성공:', purchaseResult);
    Alert.alert('구매 성공', `${pkg.product.identifier} 상품이 구매되었습니다.`);
    return true;
  } catch (e: any) {
    console.warn('구매 중 오류 발생:', e);
    if (!e.userCancelled) {
      Alert.alert('구매 실패', '오류가 발생했습니다. 다시 시도해주세요.');
    }
    return false;
  }
};
