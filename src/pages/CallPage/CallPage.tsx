//간단히 view와 text가 있는 페이지
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import MyModule from '../../../modules/my-module';
import {
  initSocket,
  connectSocket,
  disconnectSocket,
  //sendMicAudio,
  getSocket,
} from './socketManager';
import { getAccessToken } from '../../utils/storageUtils';
import { EventEmitter } from 'expo-modules-core';
import SimpleWaveform from './SimpleWaveform';
import { useAudioCall } from '../../../src/hooks/useAudioCall';
import {
  endAudioCall,
  pauseAudioCall,
  resumeAudioCall,
  startAudioCall,
  heartbeatAudioCall,
} from '../../apis/voice';
const CallPage: React.FC = () => {
  // 비즈니스 로직은 모두 커스텀 훅으로 이동
  const [state, handlers] = useAudioCall();
  const { waveform, remainingTime, responseText } = state;
  const { handleConnect, handleDisconnect, handlePause, handleResume } = handlers;

  return (
    <View style={{ paddingTop: 100 }}>
      <Text>남은 시간 : {remainingTime}초</Text>
      <SimpleWaveform data={waveform} width={360} height={80} />
      <Button title="시작(웹소켓 연결 후 서버 API 호출)" onPress={handleConnect} />
      <Button title="끊기(음성 통화 종료하기 API 호출" onPress={handleDisconnect} />
      <Button title="일시중지(pause)" onPress={handlePause} />
      <Button title="다시시작하기(resume)" onPress={handleResume} />
      <Button title="테스트" onPress={() => console.log('hi')} />
      <Text style={{ marginTop: 20, fontSize: 16 }}>🤖 Gemini: {responseText}</Text>
    </View>
  );
};

export default CallPage;
