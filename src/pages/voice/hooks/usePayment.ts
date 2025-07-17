// hooks/usePayment.ts
import { useState, useCallback } from 'react';
import Purchases from 'react-native-purchases';
import { getRemainingTime } from '@apis/voice';
import { PRODUCT_ID_MAP } from '../types/call.types';

interface UsePaymentReturn {
  isPaymentModalVisible: boolean;
  isPaymentLoading: boolean;
  showPaymentModal: () => void;
  hidePaymentModal: () => void;
  handlePayment: (minutes: number) => Promise<void>;
}

export const usePayment = (onPaymentSuccess: (remainingTime: number) => void): UsePaymentReturn => {
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const showPaymentModal = useCallback(() => {
    setIsPaymentModalVisible(true);
  }, []);

  const hidePaymentModal = useCallback(() => {
    setIsPaymentModalVisible(false);
  }, []);

  const handlePayment = useCallback(
    async (minutes: number) => {
      try {
        setIsPaymentLoading(true);

        const productIdentifier = PRODUCT_ID_MAP[minutes];
        if (!productIdentifier) {
          console.warn('해당 시간에 맞는 상품이 없습니다.');
          return;
        }

        const offerings = await Purchases.getOfferings();
        const voiceOffering = offerings.all['voiceTalks'];

        if (!voiceOffering) {
          console.warn('voiceTalks Offering을 찾을 수 없습니다.');
          return;
        }

        const product = voiceOffering.availablePackages.find(
          (pkg) => pkg.product.identifier === productIdentifier,
        );

        if (!product) {
          console.warn(`상품(${productIdentifier})을 Offering에서 찾을 수 없습니다.`);
          return;
        }

        const purchaseResult = await Purchases.purchasePackage(product);
        console.log(`${minutes}분 충전 완료`, purchaseResult);

        // 충전 후 서버에서 남은 시간 조회
        const { remainingTime } = await getRemainingTime();
        console.log('🔄 서버에서 가져온 남은 시간:', remainingTime);

        onPaymentSuccess(remainingTime);
      } catch (e: any) {
        if (!e.userCancelled) {
          console.error('결제 중 오류 발생:', e);
          // TODO: 에러 처리 UI 추가
        }
      } finally {
        setIsPaymentLoading(false);
      }
    },
    [onPaymentSuccess],
  );

  return {
    isPaymentModalVisible,
    isPaymentLoading,
    showPaymentModal,
    hidePaymentModal,
    handlePayment,
  };
};
