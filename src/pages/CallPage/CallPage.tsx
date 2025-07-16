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
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useAudioCall } from '../../../src/hooks/useAudioCall';
import { CallStatus } from '../../../src/hooks/useAudioCall';
import Header from '../../../src/components/header/header';
import palette from '../../../src/assets/styles/theme';
import IconButton from '../../../src/components/icon-button/IconButton';
import { setAudioReceiveHandler } from './socketManager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioBars } from './MicLevelBar';
import Purchases from 'react-native-purchases';
import { getCurrentOffering, updatePurchaseStatus } from '../../services/inappService';
import { getRemainingTime } from '../../apis/voice';
import { getUserNickname } from '../../utils/storageUtils';
import CallTimer from './components/CallTimer';
import CookieAvatar from './components/CookieAvatar';
import PaymentModal from './components/PaymentModal';
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

  useEffect(() => {
    const requestMicPermission = async () => {
      if (Platform.OS !== 'android') return;

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '마이크 권한 요청',
            message: '통화를 위해 마이크 접근 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거부',
            buttonPositive: '허용',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ 마이크 권한 허용됨');
        } else {
          Alert.alert(
            '마이크 권한이 거부되었습니다',
            '설정에서 마이크 권한을 수동으로 허용해 주세요.',
            [
              { text: '취소', style: 'cancel' },
              { text: '설정 열기', onPress: () => Linking.openSettings() },
            ],
          );
        }
      } catch (err) {
        console.warn('권한 요청 오류:', err);
      }
    };

    requestMicPermission();
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
        onClose={() => {
          setIsPaymentModalVisible(false);
        }}
        onPayment={handlePayment}
      />
    </>
  );
};

export default CallPage;
