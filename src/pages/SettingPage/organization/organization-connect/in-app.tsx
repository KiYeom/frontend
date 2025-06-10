// InAppTest.tsx

import React, { useEffect, useState } from 'react'; // React와 훅 기능을 불러옵니다.
import { Platform, Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // RN 컴포넌트와 스타일, 알림 등을 불러옵니다.
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  PurchaserInfo,
} from 'react-native-purchases'; // RevenueCat Purchases 모듈과 타입을 불러옵니다.

// Apple과 Google 각각에 사용할 RevenueCat 공개 API 키를 설정합니다.
/*const APIKeys = {
  apple: 'appl_fPMYhWqdXgEZtsFvoDpuZlklJSV', // iOS용 Public API Key
  google: 'your_revenuecat_google_api_key', // Android용 Public API Key
};*/

const InAppTest: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);

  // 구매 상태 갱신 함수 (재사용 가능)
  /*const updatePurchaseStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const hasActive = Object.keys(customerInfo.entitlements.active).length > 0;
      setHasPurchased(hasActive);
    } catch (e) {
      console.warn('고객 정보 조회 오류:', e);
      setHasPurchased(false);
    }
  };*/

  useEffect(() => {
    const setup = async () => {
      if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: APIKeys.google });
      } else {
        await Purchases.configure({ apiKey: APIKeys.apple });
      }

      const offerings = await Purchases.getOfferings();
      setCurrentOffering(offerings.current);
      await updatePurchaseStatus(); // 초기 구매 상태 갱신
    };

    Purchases.setDebugLogsEnabled(true);
    setup().catch(console.log);
  }, []);

  /*const purchasePackage = async (pkg: PurchasesPackage) => {
    console.log('구매 시도:', pkg.product.identifier);
    if (hasPurchased) {
      Alert.alert('알림', '이미 구매한 상품입니다.');
      return;
    }

    try {
      const purchaseResult = await Purchases.purchasePackage(pkg);
      console.log('구매 성공:', purchaseResult);
      Alert.alert('구매 성공', `${pkg.product.identifier} 상품이 구매되었습니다.`);
      await updatePurchaseStatus(); // 구매 후 상태 갱신
    } catch (e: any) {
      console.warn('구매 중 오류 발생:', e);
      if (!e.userCancelled) {
        Alert.alert('구매 실패', '오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };*/

  if (!currentOffering) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hasPurchased ? (
        <Text style={styles.statusText}>구매를 이미 했습니다</Text>
      ) : (
        <Text style={styles.statusText}>구매를 하지 않았습니다</Text>
      )}
      <Text style={styles.headerText}>Current Offering: {currentOffering.identifier}</Text>
      <Text style={styles.subHeaderText}>
        Package Count: {currentOffering.availablePackages.length}
      </Text>
      {currentOffering.availablePackages.map((pkg) => (
        <View key={pkg.identifier} style={styles.packageContainer}>
          <Text style={styles.packageText}>{pkg.product.identifier}</Text>
          <TouchableOpacity style={styles.purchaseButton} onPress={() => purchasePackage(pkg)}>
            <Text style={styles.buttonText}>구매하기</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

// 스타일 정의: 각 요소의 레이아웃 및 텍스트 스타일 등을 지정합니다.
const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면을 모두 차지
    padding: 16, // 내부 여백
    backgroundColor: '#f5f5f5', // 연한 회색 배경
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8, // 아래쪽 여백
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 16, // 아래쪽 여백
  },
  packageContainer: {
    flexDirection: 'row', // 텍스트와 버튼을 가로로 배치
    alignItems: 'center', // 세로 중앙 정렬
    justifyContent: 'space-between', // 양 끝 정렬
    backgroundColor: '#ffffff', // 흰색 배경
    padding: 12, // 내부 여백
    borderRadius: 8, // 모서리 둥글게
    marginBottom: 12, // 아이템 간 간격
    // Android 그림자
    elevation: 2,
    // iOS 그림자
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  packageText: {
    fontSize: 16, // 상품 식별자 텍스트 크기
  },
  purchaseButton: {
    backgroundColor: '#4CAF50', // 초록색 배경
    paddingVertical: 6, // 세로 패딩
    paddingHorizontal: 12, // 가로 패딩
    borderRadius: 6, // 모서리 둥글게
  },
  buttonText: {
    color: '#ffffff', // 버튼 텍스트 흰색
    fontSize: 16, // 버튼 텍스트 크기
  },
  // ▶ 추가: 구매 상태 텍스트 스타일
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
});

export default InAppTest; // InAppTest 컴포넌트를 기본으로 내보냅니다.
