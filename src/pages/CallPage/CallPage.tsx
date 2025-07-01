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

// 컴포넌트 분리
const CallTimer: React.FC<{
  remainingTime: number;
  onChargePress: () => void;
}> = ({ remainingTime, onChargePress }) => (
  <View style={{ borderColor: 'red', borderWidth: 1, flexDirection: 'row', marginTop: 36 }}>
    <Icon name="call-start" width="24" height="24" color={palette.neutral[50]} />
    <View style={{ flexDirection: 'column', borderWidth: 1, borderColor: 'gray', flexGrow: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: 'white' }}>{remainingTime}초</Text>
        <TouchableOpacity onPress={() => console.log('충전하기 버튼 클릭')}>
          <Text style={{ color: 'white' }}>충전하기</Text>
        </TouchableOpacity>
      </View>
      <ProgressBar progress={0.5} color={palette.graph[100]} style={{ height: 8 }} />
    </View>
  </View>
);

const CookieAvatar: React.FC<{
  responseText?: string;
}> = ({ responseText }) => (
  <View
    style={{
      borderColor: 'green',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text style={{ color: 'white' }}>리마인드 쿠키</Text>
    <View
      style={{
        backgroundColor: 'white',
        width: 123,
        height: 123,
        borderRadius: 100,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../../src/assets/images/callcookie.png')}
        style={{ width: 140, height: 120 }}
      />
    </View>
    <Text style={{ color: 'white' }}>쿠키의 말</Text>
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
  // 비즈니스 로직은 모두 커스텀 훅으로 이동
  const [state, handlers] = useAudioCall();
  const { waveform, remainingTime, responseText, callStatus } = state;
  const { handleConnect, handleDisconnect, handlePause, handleResume } = handlers;
  const canStart = callStatus === CallStatus.Idle;
  const canPause =
    callStatus === CallStatus.Start ||
    callStatus === CallStatus.Resumed ||
    callStatus === CallStatus.Active;
  const canResume = callStatus === CallStatus.Paused;
  const canDisconnect = callStatus !== CallStatus.Idle && callStatus !== CallStatus.End;

  return (
    <>
      <Header title="쿠키의 전화 통화" isDark={true} />
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 24,
          backgroundColor: palette.dark,
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <CallTimer
          remainingTime={remainingTime}
          onChargePress={() => console.log('충전하기 버튼 클릭')}
        />
        <CookieAvatar responseText={responseText} />
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
