//간단히 view와 text가 있는 페이지
import React, { useEffect, useState, useRef } from 'react';
import { Image } from 'expo-image';
import { View, Text, Button, TouchableOpacity } from 'react-native';
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
            <TouchableOpacity onPress={() => console.log('충전하기 버튼 클릭')}>
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
        {/* 뒤에 위치할 AudioVisualizer */}
        <AudioVisualizer isReceivingAudio={isReceivingAudio} waveform={waveform} isActive={true} />

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
    <View style={{ borderColor: 'pink', borderWidth: 1, width: 300, height: 200 }}>
      <Text style={{ color: 'white' }}>쿠키의 말</Text>
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

  useEffect(() => {
    setAudioReceiveHandler(() => {
      setIsReceivingAudio(true);

      if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = setTimeout(() => {
        setIsReceivingAudio(false);
      }, 300); // 오디오 수신 후 300ms 간 isReceivingAudio 유지
    });
  }, []);

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
          onChargePress={() => console.log('충전하기 버튼 클릭')}
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
          <MicVisualization
            waveform={waveform}
            isActive={isActive && !isReceivingAudio} // 쿠키가 말하지 않을 때만 활성화
          />
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
    </>
  );
};

export default CallPage;
