import Purchases, { PurchasesPackage, PurchasesOffering } from 'react-native-purchases';
import { Alert, Platform } from 'react-native';
import Analytics from '../utils/analytics';

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
    console.log('활성화된 entitlements:', Object.keys(customerInfo.entitlements.active));
    return Object.keys(customerInfo.entitlements.active).length > 0;
  } catch (e) {
    console.warn('고객 정보 조회 오류:', e);
    return false;
  }
};

//구매 버튼 클릭 시, 구매를 시도하는 함수
export const purchasePackage = async (
  pkg: PurchasesPackage,
  hasPurchased: boolean,
  onLoadingStart?: () => void,
  onLoadingEnd?: () => void,
) => {
  console.log('구매 시도:', pkg.product.identifier);
  if (hasPurchased) {
    Alert.alert('알림', '이미 구매한 상품입니다.');
    Analytics.watchEmojiPanelAlreadyPurchasedAlert();
    return false;
  }
  try {
    //로딩 시작
    onLoadingStart?.();
    const purchaseResult = await Purchases.purchasePackage(pkg); //실제 결제 플로우 실행
    console.log('구매 결과:', purchaseResult);
    //Alert.alert('구매 성공', `${pkg.product.identifier} 상품이 구매되었습니다.`);
    Alert.alert('구매 성공', `이모티콘 상품이 구매되었습니다.`);
    Analytics.watchEmojiPanelPurchaseCompleteAlert();
    return true;
  } catch (e: any) {
    console.warn('구매 중 오류 발생:', e);
    if (!e.userCancelled) {
      Alert.alert('구매 실패', '오류가 발생했습니다. 다시 시도해주세요.');
      Analytics.watchEmojiPanelPurchaseFailedAlert();
    }
    return false;
  } finally {
    //로딩 종료
    onLoadingEnd?.();
  }
};

//테스트 시 초기화
export const resetPurchaseState = async () => {
  await Purchases.logOut();
  await initializeInApp();
};

//복원 트랜잭션 호출
export const restoreTransactions = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    console.log('복원된 고객 정보:', customerInfo);
    if (Object.keys(customerInfo.entitlements.active).length > 0) {
      Alert.alert('복원 성공', '이모티콘 상품이 복원되었습니다.');
      //Analytics.watchEmojiPanelRestoreCompleteAlert();
      return true;
    } else {
      Alert.alert('복원 실패', '복원된 상품이 없습니다.');
      //Analytics.watchEmojiPanelRestoreFailedAlert();
      return false;
    }
  } catch (e) {
    console.warn('복원 중 오류 발생:', e);
    Alert.alert('복원 실패', '오류가 발생했습니다. 다시 시도해주세요.');
    //Analytics.watchEmojiPanelRestoreFailedAlert();
    return false;
  }
};

// 구매 이력 확인 함수 (재로그인 혹은 회원 탈퇴 이후 다시 회원가입 시)
export const checkPurchaseHistory = async () => {
  try {
    await initializeInApp();
    const hasPurchased = await restoreTransactions();
    if (hasPurchased) {
      console.log('이모티콘 상품 복원 완료');
      // Analytics.watchEmojiPanelRestoreCompleteAlert();
    } else {
      console.log('복원된 상품이 없습니다.');
    }
  } catch (error) {
    console.error('인앱 결제 초기화 실패:', error);
  }
};
