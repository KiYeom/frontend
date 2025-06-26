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
  const [wavFilePath, setWavFilePath] = useState<string | null>(null);
  const lastAudioRoute = useRef<string | null>(null);
  // 🟢 오디오 경로 변경 감지 상태 추가
  const [isAudioSessionActive, setIsAudioSessionActive] = useState(false);
  const isAudioSessionActiveRef = useRef(false);

  const setAudioSessionActive = (active: boolean) => {
    console.log('setAudioSessionActive 호출 시작:', isAudioSessionActiveRef.current);
    setIsAudioSessionActive(active);
    isAudioSessionActiveRef.current = active;
    console.log('setAudioSessionActive 호출 종료:', isAudioSessionActiveRef.current);
  };

  useEffect(() => {
    const userToken = getAccessToken();
    initSocket(userToken);
  }, []);

  useEffect(() => {
    const emitter = new EventEmitter(MyModule);
    // 🟡 시각화용 이벤트
    const sub = emitter.addListener('onAudioBuffer', (event) => {
      const samples: number[] = event.samples;
      // 파형으로 변환: 절댓값만 추출, 50개만 자름
      const normalized = samples.slice(0, 50).map((n) => Math.min(Math.abs(n), 1));
      setWaveform(normalized);

      //sendMicAudio(samples);
    });
    // ✅  (PCM 전송용)
    const micSub = emitter.addListener('onMicAudio', ({ pcm }) => {
      //console.log('📥 Received mic PCM data!', pcm); // ✅ 내가 말한 거 JS로
      //console.log('📥 Received mic PCM data!'); // ✅ 내가 말한 거 JS로
      const socket = getSocket();
      // 소켓에 연결된 경우 : 마이크 오디오 서버에 전송
      if (socket && socket.connected) {
        const payload = new Uint8Array(pcm);
        socket.emit('mic_audio', payload);
        //console.log('📤 mic_audio 전송됨:', payload.length, 'bytes');
      } else {
        console.log('❌ 소켓이 연결되지 않았습니다. mic_audio 전송 실패');
      }
    });
    // 파일 경로 받기
    const fileListener = emitter.addListener('onRecordingSaved', ({ filePath }) => {
      console.log('📁 WAV 파일 저장됨:', filePath);
      setWavFilePath(filePath); // 상태 저장
      // 예: 파일 경로를 플레이어에 넘기거나 상태에 저장
      // setWavPath(filePath);
    });
    const readySub = emitter.addListener('onRecordingReady', () => {
      console.log('🎙️ 마이크 녹음 준비 완료!');
      setAudioSessionActive(true);
      readySub.remove();
    });
    // 에어팟 <-> 스피커
    const subscription = emitter.addListener('onAudioRouteChange', (event) => {
      const newRoute = event?.newRoute;
      // 새 경로가 이전과 같으면 무시
      console.log('✅ 오디오 경로 변경 감지:', newRoute);
      console.log('🐾 현재 오디오 경로:', lastAudioRoute.current);
      if (lastAudioRoute.current === null) {
        console.log('🟡 초기 오디오 경로 설정 무시');
        lastAudioRoute.current = newRoute;
        return;
      }
      if (lastAudioRoute.current === newRoute) {
        console.log('🔁 동일한 오디오 경로 - 처리 생략');
        return;
      }
      lastAudioRoute.current = newRoute;

      if (isAudioSessionActiveRef.current) {
        console.log('활성 상태 - 오디오 경로 변경 처리');
        handlePause();
      } else {
        console.log('비활성 상태 - 오디오 경로 변경 무시');
      }
    });

    return () => {
      sub.remove();
      micSub.remove();
      fileListener.remove();
      subscription.remove();
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
        console.log('1. API 호출 시작');
        await startAudioCall(); // API 호출 (서버에 start 알림)
        console.log('2. startAudioCall 응답 받고 마이크 시작');
        MyModule.startRecording(); // 마이크 시작
        console.log('3. 마이크 시작 완료, 하트비트 시작');
        startHeartbeat(); // 하트비트 시작
        //console.log('4. 실시간 재생 시작');
        //MyModule.playNextChunk(); // 첫 번째 음성 데이터 전송 (필요시)
        //console.log('5. 오디오 세션 활성화');
        console.log('4️⃣. startAudioCall 완료');
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
      MyModule.stopRealtimePlayback(); //3. 재생 중지
      stopHeartbeat(); // 3. 하트비트 중지
    }
  };

  //일시 중지
  const handlePause = async () => {
    console.log('handlePause 호출');
    try {
      const response = await pauseAudioCall();
      console.log('✅ pauseRecording 응답:', response);
      //pause 인 동안은 음성 전송을 하면 안 됨
      MyModule.stopRecording(); // 녹음 중지
      MyModule.pauseRealtimePlayback(); // 출력 정지 (버퍼 보존)
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
      MyModule.resumeRealtimePlayback(); // 출력 재개 (버퍼 계속 재생)
      //startHeartbeat(); // 하트비트 재시작
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
        //console.log('✅ Heartbeat sent');
      } catch (e) {
        //console.warn('❌ Heartbeat failed:', e.message);
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

  return (
    <View style={{ paddingTop: 100 }}>
      <Text>{MyModule.hello()}</Text>
      <SimpleWaveform data={waveform} width={360} height={80} />
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
