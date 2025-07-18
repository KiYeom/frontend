//간단히 view와 text가 있는 페이지
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { useAudioCall } from '../../hooks/useAudioCall';
import { CallStatus } from '../../hooks/useAudioCall';
import Header from '../../components/header/Header';
import palette from '../../assets/styles/theme';
import IconButton from '../../components/icon-button/IconButton';
import { setAudioReceiveHandler } from './socketManager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioBars } from './MicLevelBar';
import Purchases from 'react-native-purchases';
import { getCurrentOffering, updatePurchaseStatus } from '../../services/inappService';
import { getRemainingTime } from '../../apis/voice';
import CallTimer from './components/CallTimer';
import CookieAvatar from './components/CookieAvatar';
import PaymentModal from './components/PaymentModal';
import { PurchasesOffering } from 'react-native-purchases';
import MyModule from '../../../modules/my-module/src/MyModule';
import Analytics from '../../utils/analytics';
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

  //구매 상태에 따라 버튼 변경
  useEffect(() => {
    Analytics.watchTabVoiceScreen(); //홈 화면 진입
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
  //마이크 권한 상
  const [micPermissionStatus, setMicPermissionStatus] = useState<
    'undetermined' | 'granted' | 'denied'
  >('undetermined');
  const [isReceivingAudio, setIsReceivingAudio] = useState(false);
  const audioTimeoutRef = useRef<NodeJS.Timeout>();
  const syncRetryCount = useRef<number>(0);
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
  const canCharge = callStatus === CallStatus.Idle;

  // 결제 모달 상태
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  // 결제 로딩 상태 추가
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAudioSessionActive, setIsAudioSessionActive] = useState(false);

  useEffect(() => {
    const activateSession = async () => {
      try {
        MyModule.activateAudioSession();
        setIsAudioSessionActive(true);
        //console.log('✅ CallPage: 오디오 세션 활성화 성공');
      } catch (error) {
        console.error('❌ CallPage: 오디오 세션 활성화 실패:', error);
        Alert.alert('오디오 초기화 실패', '오디오 기능을 사용할 수 없습니다. 앱을 재시작해주세요.');
      }
    };

    activateSession();

    return () => {
      try {
        MyModule.deactivateAudioSession();
        setIsAudioSessionActive(false);
        //console.log('✅ CallPage: 오디오 세션 비활성화 성공');
      } catch (error) {
        console.error('⚠️ CallPage: 오디오 세션 비활성화 실패:', error);
      }
    };
  }, []);

  // 통화 종료 시 오디오 세션 비활성화
  useEffect(() => {
    if (callStatus === CallStatus.End) {
      // 통화가 완전히 종료되면 잠시 후 오디오 세션 비활성화
      const timer = setTimeout(() => {
        if (isAudioSessionActive) {
          MyModule.deactivateAudioSession();
          setIsAudioSessionActive(false);
          console.log('📞 통화 종료: 오디오 세션 비활성화');
        }
      }, 1000); // 1초 후 비활성화

      return () => clearTimeout(timer);
    }
  }, [callStatus, isAudioSessionActive]);

  // 5. 오류 발생 시 복구 시도
  const handleAudioSessionError = async () => {
    console.log('🔧 오디오 세션 복구 시도...');
    try {
      // 기존 세션 정리
      MyModule.deactivateAudioSession();
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 세션 재활성화
      MyModule.activateAudioSession();
      setIsAudioSessionActive(true);
      console.log('✅ 오디오 세션 복구 성공');
    } catch (error) {
      console.error('❌ 오디오 세션 복구 실패:', error);
      Alert.alert('오디오 오류', '오디오 기능에 문제가 발생했습니다. 앱을 재시작해주세요.', [
        { text: '확인' },
      ]);
    }
  };
  const handleConnectWithSessionCheck = async () => {
    if (!isAudioSessionActive) {
      console.log('⚠️ 오디오 세션이 비활성화 상태, 재활성화 시도');
      await handleAudioSessionError();
    }
    handleConnect();
  };

  // 백엔드와 동기화하는 함수
  const syncWithBackend = async (optimisticTotalTime: number, optimisticRemainingTime: number) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    try {
      // 백엔드에서 실제 남은 시간 조회
      const { remainingTime: serverRemainingTime } = await getRemainingTime();
      console.log(
        '🔄 서버 동기화 - 서버 시간:',
        serverRemainingTime,
        '프론트 시간:',
        optimisticRemainingTime,
      );

      // 서버 값과 다른 경우에만 업데이트
      if (Math.abs(serverRemainingTime - optimisticRemainingTime) > 10) {
        // 10초 이상 차이날 때만
        console.log('⚠️ 서버와 프론트 시간 불일치 감지, 서버 값으로 업데이트');
        setTotalTime(serverRemainingTime);
        setRemainingTime(serverRemainingTime);

        // 사용자에게 알림 (선택사항)
        // Alert.alert('시간 동기화', '서버와 시간이 동기화되었습니다.');
      } else {
        console.log('✅ 서버와 프론트 시간 일치');
      }
    } catch (error) {
      console.error('백엔드 동기화 실패:', error);
      // 동기화 실패 시 재시도 로직 (선택사항)
      if (!syncRetryCount.current || syncRetryCount.current < 3) {
        syncRetryCount.current = (syncRetryCount.current || 0) + 1;
        console.log(`🔄 동기화 재시도 ${syncRetryCount.current}/3`);
        setTimeout(() => {
          syncWithBackend(optimisticTotalTime, optimisticRemainingTime);
        }, 3000);
      } else {
        console.error('❌ 동기화 최대 재시도 횟수 초과');
        syncRetryCount.current = 0;
      }
    } finally {
      setIsSyncing(false);
    }
  };

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
      if (Platform.OS !== 'android') return; // iOS는 권한 요청 필요 없음
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
          //console.log('✅ 마이크 권한 허용됨');
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
      // ✅ 낙관적 업데이트: 결제 성공 시 프론트엔드에서 먼저 시간 업데이트
      const newTotalTime = totalTime + minutes * 60; // 분을 초로 변환
      const newRemainingTime = remainingTime + minutes * 60;

      setTotalTime(newTotalTime);
      setRemainingTime(newRemainingTime);

      // 결제 모달 닫기
      setIsPaymentModalVisible(false);

      setIsSyncing(true);
      syncWithBackend(newTotalTime, newRemainingTime);

      // TODO: 구매 완료 처리 (시간 충전, 서버 동기화 등)
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error('결제 중 오류 발생:', e);
        Alert.alert('결제 오류', '결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.');
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
          onChargePress={() => {
            //console.log('충전 버튼 클릭');
            Analytics.clickTabVoiceChargeButton();
            setIsPaymentModalVisible(true);
          }}
          isLoading={isPaymentLoading}
          isSyncing={isSyncing}
          isChargeDisabled={!canCharge}
        />
        <CookieAvatar
          responseText={responseText}
          isReceivingAudio={isReceivingAudio}
          waveform={waveform}
          isActive={isActive}
          isChargeDisabled={!canCharge}
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
          onConnect={handleConnectWithSessionCheck}
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
