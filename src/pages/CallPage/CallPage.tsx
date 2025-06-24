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
  sendMicAudio,
  onGeminiResponse,
  getSocket,
} from './socketManager';
import { getAccessToken } from '../../utils/storageUtils';
import { EventEmitter } from 'expo-modules-core';
import float32ToInt16PCM from './float32ToInt16PCM';
import SimpleWaveform from './SimpleWaveform';
import {
  endAudioCall,
  pauseAudioCall,
  resumeAudioCall,
  startAudioCall,
  heartbeatAudioCall,
} from '../../apis/voice';
const CallPage: React.FC = () => {
  const [samples, setSamples] = useState<number[]>([]);
  const [responseText, setResponseText] = useState<string>('');
  const [realTimeData, setRealTimeData] = useState('');
  const [waveform, setWaveform] = useState<number[]>([]);
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const userToken = getAccessToken();
    initSocket(userToken);
  }, []);

  useEffect(() => {
    const emitter = new EventEmitter(MyModule);
    const sub = emitter.addListener('onAudioBuffer', (event) => {
      const samples: number[] = event.samples;
      // 파형으로 변환: 절댓값만 추출, 50개만 자름
      const normalized = samples.slice(0, 50).map((n) => Math.min(Math.abs(n), 1));
      setWaveform(normalized);

      sendMicAudio(samples);
    });

    return () => {
      sub.remove();
      MyModule.stopRecording?.(); // 정리
    };
  }, []);
  //console.log('mymodule', MyModule);

  //시작
  const handleConnect = async () => {
    const socket = getSocket();
    if (!socket) return;

    // 1. 소켓 연결
    socket.connect();

    // 2. 소켓 연결 완료 후에 start + 마이크 + 하트비트
    socket.once('connect', async () => {
      try {
        await startAudioCall(); // API 호출 (서버에 start 알림)
        MyModule.startRecording(); // 마이크 시작
        startHeartbeat(); // 하트비트 시작
      } catch (err) {
        console.error('❌ startAudioCall 실패:', err);
      }
    });
  };

  //소켓 연결 해제 (프론트는 먼저 소켓 연결을 끊지 않는다)
  const handleDisconnect = async () => {
    try {
      const response = await endAudioCall(); //1. 서버에 종료 요청
    } catch (err) {
      console.error('❌ endAudioCall 실패:', err);
    } finally {
      MyModule.stopRecording(); //2. 마이크 중지
      stopHeartbeat(); // 3. 하트비트 중지
    }
  };

  const handleEnd = () => {
    MyModule.stopRecording();
  };

  //일시 중지
  const handlePause = async () => {
    console.log('handlePause 호출');
    try {
      const response = await pauseAudioCall();
      console.log('✅ pauseRecording 응답:', response);
      //pause 인 동안은 음성 전송을 하면 안 됨
      stopHeartbeat(); // 하트비트 중지
      MyModule.stopRecording(); // 녹음 중지
      // 소켓 연결은 유지
    } catch (err) {
      console.error('❌ pauseRecording 실패:', err);
    }
  };

  //다시시작하기 (resume)
  const handleResume = async () => {
    console.log('handleResume 호출');
    try {
      const response = await resumeAudioCall();
      console.log('✅ resumeRecording 응답:', response);
      MyModule.startRecording(); // 마이크 재시작
      startHeartbeat(); // 하트비트 재시작
    } catch (err) {
      console.error('❌ resumeRecording 실패:', err);
    }
  };

  //5초동안 하트비트 시작
  const startHeartbeat = () => {
    if (heartbeatTimer.current) return;

    heartbeatTimer.current = setInterval(async () => {
      try {
        await heartbeatAudioCall();
        console.log('✅ Heartbeat sent');
      } catch (e) {
        console.warn('❌ Heartbeat failed:', e.message);
      }
    }, 5000); // 5초 간격
  };

  const stopHeartbeat = () => {
    console.log('하트 비트 중지');
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = null;
      console.log('✅ Heartbeat stopped');
    }
  };

  const handleAudioBuffer = (samples: number[]) => {
    const int16Buffer = float32ToInt16PCM(samples);
    sendMicAudio(int16Buffer); // 전송!
  };
  //마이크 스트림 + 음성 전송
  const initAudioGraph = async () => {
    console.log('initAudioGraph 호출');
  };
  const testRecord = async () => {
    MyModule.startRecording();
  };

  return (
    <View style={{ paddingTop: 100 }}>
      <Text>하이맨</Text>
      <SimpleWaveform data={waveform} width={360} height={80} />
      <Text>{MyModule.hello()}</Text>
      <Button title="녹음 시작" onPress={testRecord} />
      <Button title="녹음 중지" onPress={handleEnd} />
      <Button title="시작(웹소켓 연결 후 서버 API 호출)" onPress={handleConnect} />
      <Button title="끊기(음성 통화 종료하기 API 호출" onPress={handleDisconnect} />
      <Button title="일시중지(pause)" onPress={handlePause} />
      <Button title="다시시작하기(resume)" onPress={handleResume} />
      <Button title="테스트" onPress={() => console.log('hi')} />
      <Text style={{ fontFamily: 'Courier', fontSize: 12 }}>
        {samples.map((n) => n.toFixed(2)).join(', ')}
      </Text>
      <Text style={{ marginTop: 20, fontSize: 16 }}>🤖 Gemini: {responseText}</Text>
    </View>
  );
};

export default CallPage;
