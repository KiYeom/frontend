import Purchases, { PurchasesPackage, PurchasesOffering } from 'react-native-purchases';
import { Alert, Platform } from 'react-native';
import Analytics from '../utils/analytics';
import { jwtDecode } from 'jwt-decode';

const APIKeys = {
  apple: 'appl_fPMYhWqdXgEZtsFvoDpuZlklJSV',
  google: 'your_revenuecat_google_api_key',
};

const ENTITLEMENT_ID = 'emoji_v1_unlock'; // RevenueCat에서 설정한 entitlement ID

export const initializeInApp = async () => {
  if (Platform.OS === 'android') {
    await Purchases.configure({ apiKey: APIKeys.google });
  } else {
    await Purchases.configure({ apiKey: APIKeys.apple });
  }
  Purchases.setDebugLogsEnabled(true);
};
/*
  const decodedToken = jwtDecode<{ userId: string }>(accessToken);
  const userId = decodedToken.userId;
*/

//초기화 함수
export const NewInitializeInApp = async () => {
  console.log('In-App 결제 초기화 시작, 함수 : NewInitializeInApp');
  if (Platform.OS === 'android') {
    await Purchases.configure({ apiKey: APIKeys.google, appUserID: null });
  } else {
    await Purchases.configure({ apiKey: APIKeys.apple, appUserID: null });
  }
};

//로그인 함수
export const NewLoginInApp = async (accessToken: string) => {
  console.log('In-App 결제 로그인 시작, 함수 : NewLoginInApp');
  const decodedToken = jwtDecode<{ userId: string }>(accessToken);
  const userId = String(decodedToken.userId);
  console.log('타입 확인', typeof userId, userId);
  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.error('In-App 결제 로그인 실패:', error);
  }
  console.log('In-App 결제 로그인 성공, userId:', userId);
};

//현재 활성화된 상품 정보 조회
export const getCurrentOffering = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
};

//구매 상태 체크 함수
export const updatePurchaseStatus = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log('고객 정보', customerInfo?.entitlements?.active);
    if (typeof customerInfo.entitlements.active[ENTITLEMENT_ID] === 'undefined') {
      console.log('활성화된 entitlements가 없습니다.');
      return false;
    } else {
      console.log('활성화된 entitlements가 있습니다.');
      console.log('활성화된 entitlements:', Object.keys(customerInfo.entitlements.active));
      console.log('고객 정보', customerInfo.entitlements.active);
      return true;
    }
    //console.log('활성화된 entitlements:', Object.keys(customerInfo.entitlements.active));
    //console.log('고객 정보', customerInfo.entitlements.active);
    //return Object.keys(customerInfo.entitlements.active[ENTITLEMENT_ID]).length > 0;
  } catch (e) {
    console.warn('고객 정보 조회 오류:', e.essage);
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

//복원 트랜잭션 호출
export const restoreTransactions = async () => {
  console.log('복원 트랜잭션 호출 시작');
  try {
    const customerInfo = await Purchases.restorePurchases();
    console.log('복원된 고객 정보:', customerInfo);
    if (Object.keys(customerInfo.entitlements.active).length > 0) {
      Alert.alert('복원 성공', '이모티콘 상품이 복원되었습니다.');
      //Analytics.watchEmojiPanelRestoreCompleteAlert();
      return true;
    } else {
      Alert.alert('복원 실패', '복원된 상품이 없습니다.'); //복원 실패이면 사실 복원된 값이 없는거니까 Alert 안 띄워도 됨
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
  console.log('In-App 결제 구매 이력 확인 시작');
  try {
    //await initializeInApp();
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

// 회원가입 직후 또는 로그인 전에 호출
export const tryRestoreEntitlementsForNewUser = async (accessToken?: string) => {
  const decodedToken = jwtDecode<{ userId: string }>(accessToken);
  const newUserId = String(decodedToken.userId);

  console.log(
    '새 계정용 구매 복원 시도(tryRestoreEntitlementsForNewUser), newUserId : ',
    newUserId,
  );

  // Step 1: 익명 사용자로 복원
  const customerInfo = await Purchases.restorePurchases(); // 스토어 기반으로 이전 구매 내역 가져오기
  console.log('복원된 고객 정보:', customerInfo);

  // Step 2: 유효한 구매가 있는지 확인
  const hasEntitlements = Object.keys(customerInfo.entitlements.active).length > 0;
  if (!hasEntitlements) {
    console.log('복원된 구매 내역 없음');
    return false;
  }

  console.log('이전 구매 내역 복원 성공:', customerInfo.entitlements.active);

  // Step 3: 새로운 userId로 logIn + alias 만들기
  try {
    const logInResult = await Purchases.logIn(newUserId);
    console.log('logIn 결과:', logInResult);
  } catch (err) {
    console.error('logIn 실패:', err);
  }

  console.log('새 userId에 구매 연결 완료', newUserId);

  return true;
};
