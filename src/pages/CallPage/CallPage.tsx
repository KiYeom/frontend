//간단히 view와 text가 있는 페이지
import React, { useEffect, useState, useRef } from 'react';
import { Image } from 'expo-image';
import { View, Text, Button, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useAudioCall } from '../../../src/hooks/useAudioCall';
import { CallStatus } from '../../../src/hooks/useAudioCall';
import Header from '../../../src/components/header/header';
import { ProgressBar } from 'react-native-paper';
import palette from '../../../src/assets/styles/theme';
import IconButton from '../../../src/components/icon-button/IconButton';
import Icon from '../../../src/components/icons/icons';
import { AudioVisualizer } from './AudioVisualizer';
import { MicVisualization } from './MicVisualization';
import { setAudioReceiveHandler } from './socketManager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

// 컴포넌트 분리
const CallTimer: React.FC<{
  remainingTime: number;
  onChargePress: () => void;
}> = ({ remainingTime, onChargePress }) => {
  const isCritical = remainingTime <= 180;
  console.log('남은 시간:', remainingTime, '초', isCritical);
  const color = isCritical ? '#DA1E28' : '#8CC1FF';
  return (
    <View
      style={{ borderColor: 'red', borderWidth: 1, flexDirection: 'row', marginTop: 36, gap: 8 }}>
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
          borderWidth: 1,
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
            <Text style={{ color: 'white', fontSize: 18 }}>
              {remainingTime}초 <Text style={{ color: 'white', fontSize: 10 }}>남았습니다</Text>
            </Text>
            <TouchableOpacity onPress={onChargePress}>
              <Text style={{ color: 'white' }}>충전하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ProgressBar
          progress={0.5}
          color={color}
          style={{ height: 8, backgroundColor: '#E0E0E0', borderRadius: 10 }}
        />
      </View>
    </View>
  );
};

const CookieAvatar: React.FC<{
  responseText?: string;
  isReceivingAudio: boolean;
  waveform: number[];
  isActive: boolean;
}> = ({ responseText, isReceivingAudio, waveform, isActive }) => (
  <View
    style={{
      borderColor: 'green',
      borderWidth: 1,
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
          borderWidth: 1,
        }}>
        {/* 뒤에 위치할 AudioVisualizer
        <AudioVisualizer isReceivingAudio={isReceivingAudio} waveform={waveform} isActive={true} /> */}

        {/* 앞에 위치할 쿠키 이미지 */}
        <Text style={{ color: 'white', paddingBottom: 10 }}>리마인드 쿠키</Text>
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
    <View style={{ borderColor: 'pink', borderWidth: 1, width: 310, height: 17 * 8 }}>
      <ScrollView
        style={{ height: 17 * 5 }}
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
            `찾아와줘서 고마워요, reMIND님\n마음 속의 생각을 편하게 이야기 해 주세요`}
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

  return (
    <View
      style={{
        borderColor: 'yellow',
        borderWidth: 1,
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
  const [state, handlers] = useAudioCall();
  const { waveform, remainingTime, responseText, callStatus } = state;
  const { handleConnect, handleDisconnect, handlePause, handleResume } = handlers;
  // gemini_audio 수신 상태 관리
  const [isReceivingAudio, setIsReceivingAudio] = useState(false);
  const audioTimeoutRef = React.useRef<NodeJS.Timeout>();
  const isActive =
    callStatus === CallStatus.Start ||
    callStatus === CallStatus.Resumed ||
    callStatus === CallStatus.Active;

  const canStart = callStatus === CallStatus.Idle;
  const canPause =
    callStatus === CallStatus.Start ||
    callStatus === CallStatus.Resumed ||
    callStatus === CallStatus.Active;
  const canResume = callStatus === CallStatus.Paused;
  const canDisconnect = callStatus !== CallStatus.Idle && callStatus !== CallStatus.End;

  // 결제 모달 상태
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  useEffect(() => {
    setAudioReceiveHandler(() => {
      setIsReceivingAudio(true);

      if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = setTimeout(() => {
        setIsReceivingAudio(false);
      }, 300); // 오디오 수신 후 300ms 간 isReceivingAudio 유지
    });
  }, []);

  const handlePayment = (minutes: number) => {
    // 여기에 실제 결제 로직을 구현
    console.log(`${minutes}분 충전 완료`);
    // 충전 후 remainingTime 업데이트 로직 추가
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
          remainingTime={remainingTime}
          onChargePress={() => setIsPaymentModalVisible(true)}
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
            borderWidth: 1,
            padding: 16,
            gap: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/*<MicVisualization
            waveform={waveform}
            isActive={isActive && !isReceivingAudio} // 쿠키가 말하지 않을 때만 활성화
          />*/}
          <View style={{ height: 50, width: 50, backgroundColor: 'pink' }}></View>
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
