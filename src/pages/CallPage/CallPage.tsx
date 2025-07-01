//간단히 view와 text가 있는 페이지
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import { useAudioCall } from '../../../src/hooks/useAudioCall';
import { CallStatus } from '../../../src/hooks/useAudioCall';
import Header from '../../../src/components/header/header';
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
      <Header title="쿠키의 전화 통화" />
      <View>
        <Text>타이머</Text>
        <View>
          <Text>progressbar</Text>
        </View>
      </View>
      <Text>상태 : {callStatus}</Text>
      <Text>남은 시간 : {remainingTime}초</Text>
      <Button
        title="시작(웹소켓 연결 후 서버 API 호출)"
        onPress={handleConnect}
        disabled={!canStart}
      />
      <Button
        title="끊기(음성 통화 종료하기 API 호출"
        onPress={handleDisconnect}
        disabled={!canDisconnect}
      />
      <Button title="일시중지(pause)" onPress={handlePause} disabled={!canPause} />
      <Button title="다시시작하기(resume)" onPress={handleResume} disabled={!canResume} />
      <Text style={{ marginTop: 20, fontSize: 16 }}>🤖 Gemini: {responseText}</Text>
    </View>
  );
};

export default CallPage;
