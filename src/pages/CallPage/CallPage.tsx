//간단히 view와 text가 있는 페이지
import React, { useEffect, useState, useRef } from 'react';
import { Image } from 'expo-image';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useAudioCall } from '../../../src/hooks/useAudioCall';
import { CallStatus } from '../../../src/hooks/useAudioCall';
import Header from '../../../src/components/header/header';
import { ProgressBar } from 'react-native-paper';
import palette from '../../../src/assets/styles/theme';
import IconButton from '../../../src/components/icon-button/IconButton';
import Icon from '../../../src/components/icons/icons';
import { setAudioReceiveHandler } from './socketManager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioBars } from './MicLevelBar';
import Purchases from 'react-native-purchases';
import { getCurrentOffering, updatePurchaseStatus } from '../../services/inappService';
import { getRemainingTime } from '../../apis/voice';
import { getUserNickname } from '../../utils/storageUtils';
// 결제 모달 컴포넌트
const PaymentModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onPayment: (amount: number) => void;
}> = ({ visible, onClose, onPayment }) => {
  const paymentOptions = [
    { minutes: 10, price: 2200, label: '10분' },
    { minutes: 30, price: 5900, label: '30분' },
    { minutes: 60, price: 10900, label: '60분' },
    { minutes: 120, price: 19900, label: '120분' },
  ];

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
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
            {paymentOptions.map((option, index) => (
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
    </Modal>
  );
};

const CallTimer: React.FC<{
  remainingTime: number;
  totalTime: number; // 전체 시간 (선택적)
  onChargePress: () => void;
  isLoading?: boolean; // 로딩 상태 추가
}> = ({ totalTime, remainingTime, onChargePress, isLoading = false }) => {
  //console.log('CallTimer 렌더링', { remainingTime, totalTime });

  // 초를 hh:mm:ss 형식으로 변환하는 함수
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCritical = remainingTime <= 180; // 3분 이하일 때 critical로 간주
  const color = isCritical ? '#DA1E28' : '#8CC1FF';
  const progress = totalTime > 0 ? remainingTime / totalTime : 0;

  return (
    <View style={{ borderColor: 'red', flexDirection: 'row', marginTop: 36, gap: 8 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon name="clock" width="24" height="24" color={palette.neutral[50]} />
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderColor: 'gray',
          flex: 1,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flex: 1,
            }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
              {isLoading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size="small" color="white" />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'Pretendard-Medium',
                    }}>
                    로딩중...
                  </Text>
                </View>
              ) : (
                <>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      lineHeight: 28,
                      fontFamily: 'Pretendard-Medium',
                      width: 85,
                    }}>
                    {formatTime(remainingTime)}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      fontFamily: 'Pretendard-Medium',
                    }}>
                    남았습니다
                  </Text>
                </>
              )}
            </View>
            <TouchableOpacity
              onPress={onChargePress}
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? palette.neutral[400] : palette.primary[500],
                padding: 5,
                borderRadius: 5,
              }}>
              <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Pretendard-SemiBold' }}>
                충전하기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ProgressBar
          progress={progress}
          color={color}
          style={{ height: 8, backgroundColor: '#E0E0E0', borderRadius: 10 }}
        />
      </View>
    </View>
  );
};

const userNickname = getUserNickname(); // 사용자 닉네임 가져오기
const CookieAvatar: React.FC<{
  responseText?: string;
  isReceivingAudio: boolean;
  waveform: number[];
  isActive: boolean;
}> = ({ responseText, isReceivingAudio, waveform, isActive }) => (
  <View
    style={{
      borderColor: 'green',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    }}>
    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
      {/* 쿠키 이미지와 애니메이션을 함께 배치 */}
      <View
        style={{
          width: 250,
          height: 250,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: 'purple',
        }}>
        {/*<AudioVisualizer isReceivingAudio={isReceivingAudio} waveform={waveform} isActive={true} />
         앞에 위치할 쿠키 이미지 */}
        <Text
          style={{
            color: 'white',
            paddingBottom: 10,
            fontSize: 17,
            fontFamily: 'Pretendard-SemiBold',
          }}>
          리마인드 쿠키
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            width: 123,
            height: 123,
            borderRadius: 100,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <Image
            source={require('../../../src/assets/images/callcookie.png')}
            style={{ width: 140, height: 120 }}
          />
        </View>
      </View>
    </View>
    <View style={{ borderColor: 'pink', width: 310, height: 17 * 8 }}>
      <ScrollView
        style={{ height: 17 * 5 + 10 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'Kyobo-handwriting',
            fontSize: 17,
            textAlign: 'center',
            lineHeight: 24,
          }}>
          {responseText ||
            `찾아와줘서 고마워요, ${userNickname ? `${userNickname}님` : ''}\n마음 속의 생각을 편하게 이야기 해 주세요`}
        </Text>
      </ScrollView>
    </View>
  </View>
);

const CallControls: React.FC<{
  canStart: boolean;
  canPause: boolean;
  canResume: boolean;
  canDisconnect: boolean;
  onConnect: () => void;
  onPause: () => void;
  onResume: () => void;
  onDisconnect: () => void;
}> = ({
  canStart,
  canPause,
  canResume,
  canDisconnect,
  onConnect,
  onPause,
  onResume,
  onDisconnect,
}) => {
  const controls = [
    { name: 'call-start', onPress: onConnect, disabled: !canStart },
    { name: 'call-pause', onPress: onPause, disabled: !canPause },
    { name: 'call-resume', onPress: onResume, disabled: !canResume },
    { name: 'call-end', onPress: onDisconnect, disabled: !canDisconnect },
  ];
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  //구매 상태에 따라 버튼 변경
  useEffect(() => {
    const setup = async () => {
      const offering = await getCurrentOffering();
      setCurrentOffering(offering); //판매 상품
      const purchased = await updatePurchaseStatus();
      setHasPurchased(purchased); //구매 상태 (true/false) 설정
      console.log('offering:', offering);
      //offeringIdentifier : "emoji_offering"
      console.log('구매 상태:', purchased);
    };
    setup().catch(console.log);
  }, []);

  return (
    <View
      style={{
        borderColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
      }}>
      {controls.map((control, index) => (
        <IconButton
          key={`${control.name}-${index}`}
          name={control.name}
          width="24"
          height="24"
          onPress={control.onPress}
          disabled={control.disabled}
        />
      ))}
    </View>
  );
};

const CallPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  // 비즈니스 로직은 모두 커스텀 훅으로 이동
  const [state, handlers] = useAudioCall(); // ✅ 단 한 번만 호출
  const { waveform, remainingTime, totalTime, responseText, callStatus, volumeLevel } = state;
  const {
    handleConnect,
    handleDisconnect,
    handlePause,
    handleResume,
    setTotalTime,
    setRemainingTime,
  } = handlers;
  // gemini_audio 수신 상태 관리
  const [isReceivingAudio, setIsReceivingAudio] = useState(false);
  const audioTimeoutRef = React.useRef<NodeJS.Timeout>();
  const isActive =
    callStatus === CallStatus.Start ||
    callStatus === CallStatus.Resumed ||
    callStatus === CallStatus.Active;

  const canStart = callStatus === CallStatus.Idle && totalTime > 0;
  const canPause =
    callStatus === CallStatus.Start ||
    callStatus === CallStatus.Resumed ||
    callStatus === CallStatus.Active;
  const canResume = callStatus === CallStatus.Paused;
  const canDisconnect = callStatus !== CallStatus.Idle && callStatus !== CallStatus.End;

  // 결제 모달 상태
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  // 결제 로딩 상태 추가
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    setAudioReceiveHandler(() => {
      setIsReceivingAudio(true);

      if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = setTimeout(() => {
        setIsReceivingAudio(false);
      }, 300); // 오디오 수신 후 300ms 간 isReceivingAudio 유지
    });
  }, []);

  const handlePayment = async (minutes: number) => {
    try {
      // 로딩 시작
      setIsPaymentLoading(true);

      const productIdMap: Record<number, string> = {
        10: 'time_10min',
        30: 'time_30min',
        60: 'time_60min',
        120: 'time_120min',
      };

      const productIdentifier = productIdMap[minutes];
      if (!productIdentifier) {
        console.warn('해당 시간에 맞는 상품이 없습니다.');
        setIsPaymentLoading(false);
        return;
      }

      const offerings = await Purchases.getOfferings();
      const voiceOffering = offerings.all['voiceTalks'];

      if (!voiceOffering) {
        console.warn('voiceTalks Offering을 찾을 수 없습니다.');
        setIsPaymentLoading(false);
        return;
      }

      const product = voiceOffering.availablePackages.find(
        (pkg) => pkg.product.identifier === productIdentifier,
      );

      if (!product) {
        console.warn(`상품(${productIdentifier})을 Offering에서 찾을 수 없습니다.`);
        setIsPaymentLoading(false);
        return;
      }

      const purchaseResult = await Purchases.purchasePackage(product);
      console.log(`${minutes}분 충전 완료`, purchaseResult);
      // ✅ 충전 후 서버에서 남은 시간 조회
      const { remainingTime } = await getRemainingTime();
      console.log('🔄 서버에서 가져온 남은 시간:', remainingTime);

      setTotalTime(remainingTime);
      setRemainingTime(remainingTime);

      // TODO: 구매 완료 처리 (시간 충전, 서버 동기화 등)
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error('결제 중 오류 발생:', e);
      }
    } finally {
      // 로딩 종료
      setIsPaymentLoading(false);
    }
  };

  return (
    <>
      <Header title="쿠키의 전화 통화" isDark={true} />
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom,
          backgroundColor: palette.dark,
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <CallTimer
          totalTime={totalTime}
          remainingTime={remainingTime}
          onChargePress={() => setIsPaymentModalVisible(true)}
          isLoading={isPaymentLoading}
        />
        <CookieAvatar
          responseText={responseText}
          isReceivingAudio={isReceivingAudio}
          waveform={waveform}
          isActive={isActive}
        />
        <View
          style={{
            borderColor: 'blue',
            padding: 16,
            gap: 8,
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: 100,
          }}>
          <AudioBars volume={volumeLevel} isActive={isActive} />
          <Text style={{ color: 'white' }}>이야기 하세요</Text>
        </View>
        <CallControls
          canStart={canStart}
          canPause={canPause}
          canResume={canResume}
          canDisconnect={canDisconnect}
          onConnect={handleConnect}
          onPause={handlePause}
          onResume={handleResume}
          onDisconnect={handleDisconnect}
        />
      </View>
      {/* 결제 모달 */}
      <PaymentModal
        visible={isPaymentModalVisible}
        onClose={() => setIsPaymentModalVisible(false)}
        onPayment={handlePayment}
      />
    </>
  );
};

export default CallPage;
