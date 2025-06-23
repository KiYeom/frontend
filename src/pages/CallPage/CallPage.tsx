//간단히 view와 text가 있는 페이지
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import MyModule from '../../../modules/my-module';
import {
  initSocket,
  connectSocket,
  disconnectSocket,
  sendMicAudio,
  onGeminiResponse,
  getSocket,
} from './socketManager';
import { getAccessToken } from '../../utils/storageUtils';
import { EventEmitter } from 'expo-modules-core';
import float32ToInt16PCM from './float32ToInt16PCM';
import { startAudioCall } from '../../apis/voice';
const CallPage: React.FC = () => {
  const [samples, setSamples] = useState<number[]>([]);
  const [responseText, setResponseText] = useState<string>('');
  const [realTimeData, setRealTimeData] = useState('');
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    const userToken = getAccessToken();
    initSocket(userToken);
  }, []);

  useEffect(() => {
    const emitter = new EventEmitter(MyModule);
    const sub = emitter.addListener('onAudioBuffer', (event) => {
      const samples: number[] = event.samples;
      sendMicAudio(samples);
    });

    return () => {
      sub.remove();
      MyModule.stopRecording?.(); // 정리
    };
  }, []);
  //console.log('mymodule', MyModule);

  const handleStart = async () => {
    MyModule.startRecording();
  };

  const handleConnect = async () => {
    connectSocket(); // 1. 소켓 연결

    const socket = getSocket();
    if (!socket) return;

    socket.once('connect', async () => {
      console.log('✅ WebSocket 연결됨');

      try {
        const response = await startAudioCall(); // 2. 연결된 후에 start 호출
        console.log('✅ startAudioCall 응답:', response);
      } catch (err) {
        console.error('❌ startAudioCall 실패:', err);
      }
    });
  };

  const handleEnd = () => {
    MyModule.stopRecording();
  };

  const handleAudioBuffer = (samples: number[]) => {
    const int16Buffer = float32ToInt16PCM(samples);
    sendMicAudio(int16Buffer); // 전송!
  };

  return (
    <View style={{ paddingTop: 100 }}>
      <Text>소켓 상태: 버튼으로 연결</Text>
      <Text>{MyModule.hello()}</Text>
      <Button title="녹음 시작" onPress={handleStart} />
      <Button title="녹음 중지" onPress={handleEnd} />
      <Button title="연결하기!!!!!" onPress={handleConnect} />
      <Button title="끊기" onPress={disconnectSocket} />
      <Button title="테스트" onPress={() => console.log('hi')} />
      <Text style={{ fontFamily: 'Courier', fontSize: 12 }}>
        {samples.map((n) => n.toFixed(2)).join(', ')}
      </Text>
      <Text style={{ marginTop: 20, fontSize: 16 }}>🤖 Gemini: {responseText}</Text>
    </View>
  );
};

export default CallPage;
