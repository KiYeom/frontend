import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import palette from '@assets/styles/theme';
import { PAYMENT_OPTIONS } from '../types/call.types';
type PaymentModalProps = {
  visible: boolean;
  onClose: () => void;
  onPayment: (minutes: number) => void;
};
const PaymentModal = (props: PaymentModalProps) => {
  const { visible, onClose, onPayment } = props;
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: 40,
              minHeight: 400,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: palette.neutral[900],
                }}>
                통화 시간 충전
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  padding: 8,
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    color: palette.neutral[500],
                  }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: palette.neutral[500],
                marginBottom: 30,
              }}>
              쿠키에게 전화를 하려면 통화 시간권 구입이 필요해요
            </Text>

            <View style={{ gap: 12 }}>
              {PAYMENT_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: palette.neutral[100],
                    marginBottom: 12,
                  }}
                  onPress={() => {
                    console.log(`${option.label} 결제 시작 - ${option.price}원`);
                    onPayment(option.minutes);
                    onClose();
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: palette.neutral[900],
                    }}>
                    {option.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: palette.primary[500],
                      fontWeight: '500',
                    }}>
                    {option.price.toLocaleString()}원
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
export default PaymentModal;
