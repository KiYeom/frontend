//간단히 view와 text가 있는 페이지
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import { useAudioCall } from '../../../src/hooks/useAudioCall';
import { CallStatus } from '../../../src/hooks/useAudioCall';
import Header from '../../../src/components/header/header';
import { ProgressBar } from 'react-native-paper';
import palette from '../../../src/assets/styles/theme';
import IconButton from '../../../src/components/icon-button/IconButton';
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
  const canDisconnect =
    callStatus !== CallStatus.Idle &&
    callStatus !== CallStatus.End &&
    callStatus !== CallStatus.Paused;

  return (
    <View>
      <Header title="쿠키의 전화 통화" isDark={true} />
      <View style={{ paddingHorizontal: 24, backgroundColor: palette.dark }}>
        <View>
          <Text>타이머</Text>
          <View>
            <ProgressBar progress={0.5} color={palette.graph[100]} style={{ height: 8 }} />
          </View>
        </View>
        <Text>상태 : {callStatus}</Text>
        <Text>남은 시간 : {remainingTime}초</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
          <IconButton
            name="call-start"
            width="24"
            height="24"
            onPress={handleConnect}
            disabled={!canStart}
          />
          <IconButton
            name="call-pause"
            width="24"
            height="24"
            onPress={handlePause}
            disabled={!canDisconnect}
          />
          <IconButton
            name="call-resume"
            width="24"
            height="24"
            onPress={handleResume}
            disabled={!canResume}
          />
          <IconButton
            name="call-end"
            width="24"
            height="24"
            onPress={handleDisconnect}
            disabled={!canPause}
          />
        </View>
      </View>
    </View>
  );
};

export default CallPage;
