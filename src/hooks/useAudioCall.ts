// hooks/useAudioCall.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import { EventEmitter } from 'expo-modules-core';
import MyModule from '../../modules/my-module';
import { getAccessToken } from '../utils/storageUtils';
import { initSocket, getSocket } from '../pages/CallPage/socketManager';
import {
  endAudioCall,
  pauseAudioCall,
  resumeAudioCall,
  startAudioCall,
  heartbeatAudioCall,
  getRemainingTime,
} from '../apis/voice';

export enum CallStatus {
  Idle = 'idle',
  Start = 'start',
  Paused = 'pause',
  Resumed = 'resume',
  End = 'end',
  Active = 'acrtive',
}

interface AudioCallState {
  waveform: number[];
  wavFilePath: string | null;
  isAudioSessionActive: boolean;
  remainingTime: number;
  totalTime: number;
  responseText: string;
  callStatus: CallStatus;
}

interface AudioCallHandlers {
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handlePause: () => Promise<void>;
  handleResume: () => Promise<void>;
}

export const useAudioCall = (): [AudioCallState, AudioCallHandlers] => {
  // State
  const [waveform, setWaveform] = useState<number[]>([]);
  const [wavFilePath, setWavFilePath] = useState<string | null>(null);
  const [isAudioSessionActive, setIsAudioSessionActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [responseText, setResponseText] = useState<string>('');
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.Idle);

  // Refs
  const isAudioSessionActiveRef = useRef(false);
  const lastAudioRoute = useRef<string | null>(null);
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  // Helper function
  const setAudioSessionActive = useCallback((active: boolean) => {
    console.log('setAudioSessionActive 호출:', active);
    setIsAudioSessionActive(active);
    isAudioSessionActiveRef.current = active;
  }, []);

  // Socket initialization
  useEffect(() => {
    const userToken = getAccessToken();
    initSocket(userToken);
  }, []);

  // 기존 useEffect와 별개로 추가
  useEffect(() => {
    const loadTotalTime = async () => {
      try {
        const data = await getRemainingTime();
        console.log('⏱️ 총 통화 시간 불러옴:', data.remainingTime, '초');
        setTotalTime(data.remainingTime);
        setRemainingTime(data.remainingTime); // 이 시점에 remainingTime도 초기화 가능
      } catch (err) {
        console.error('❌ 총 통화 시간 가져오기 실패:', err);
      }
    };

    loadTotalTime();
  }, []);

  // Event listeners setup
  useEffect(() => {
    const emitter = new EventEmitter(MyModule);

    // 시각화용 이벤트
    const audioBufferSub = emitter.addListener('onAudioBuffer', (event) => {
      const samples: number[] = event.samples;
      const normalized = samples.slice(0, 50).map((n) => Math.min(Math.abs(n), 1));
      setWaveform(normalized);
      //console.log('🔊 오디오 버퍼 이벤트 수신:', normalized);
    });

    // PCM 전송용
    const micSub = emitter.addListener('onMicAudio', ({ pcm }) => {
      const socket = getSocket();
      if (socket && socket.connected) {
        const payload = new Uint8Array(pcm);
        socket.emit('mic_audio', payload);
      } else {
        console.log('❌ 소켓이 연결되지 않았습니다. mic_audio 전송 실패');
      }
    });

    // 파일 경로 받기
    const fileListener = emitter.addListener('onRecordingSaved', ({ filePath }) => {
      console.log('📁 WAV 파일 저장됨:', filePath);
      setWavFilePath(filePath);
    });

    const readySub = emitter.addListener('onRecordingReady', () => {
      console.log('🎙️ 마이크 녹음 준비 완료!');
      setAudioSessionActive(true);
      readySub.remove();
    });

    // 오디오 경로 변경 감지
    const routeChangeSub = emitter.addListener('onAudioRouteChange', (event) => {
      const newRoute = event?.newRoute;
      console.log('✅ 오디오 경로 변경 감지:', newRoute);

      if (lastAudioRoute.current === null) {
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
      }
    });

    return () => {
      audioBufferSub.remove();
      micSub.remove();
      fileListener.remove();
      routeChangeSub.remove();
      MyModule.stopRecording?.();
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
    };
  }, []);

  // Heartbeat management
  const startHeartbeat = useCallback(() => {
    if (heartbeatTimer.current) return;

    heartbeatTimer.current = setInterval(async () => {
      try {
        const data = await heartbeatAudioCall();
        console.log('💓 Heartbeat 응답:', data);
        setRemainingTime(data.remainingTime);
      } catch (e) {
        console.warn('❌ Heartbeat failed:', e.message);
      }
    }, 5000);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = null;
      console.log('✅ Heartbeat stopped');
    }
  }, []);
  useEffect(() => {
    console.log('남은 시간 변화 : ', remainingTime, '초');
  }, [remainingTime]);

  // Countdown management
  const startCountdown = useCallback(() => {
    console.log('🚀 startCountdown 진입');
    console.log('🧭 countdownTimer.current 상태:', countdownTimer.current);
    if (countdownTimer.current) {
      console.log('🔁 이미 카운트다운이 진행 중입니다.');
      return;
    }
    console.log('⏳ 카운트다운 시작');

    countdownTimer.current = setInterval(() => {
      console.log('⏲️ 카운트다운 tick');
      setRemainingTime((prev) => {
        const next = Math.max(prev - 1, 0); //테스트 : 10초씩 감소
        console.log('🕐 remainingTime 업데이트:', prev, '→', next);
        return Math.max(prev - 1, 0);
      });
    }, 1000);
  }, []);

  const stopCountdown = useCallback(() => {
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }
  }, []);

  // Handler functions
  const handleConnect = useCallback(async () => {
    const socket = getSocket();
    console.log('🔹 handleConnect 호출:', socket?.connected);
    if (!socket) return;

    socket.connect();

    socket.once('connect', async () => {
      try {
        console.log('1. API 호출 시작');
        const response = await startAudioCall();
        console.log('✅ startAudioCall 응답:', response);
        setCallStatus(CallStatus.Start);
        console.log('2. startAudioCall 응답 받고 마이크 시작');
        MyModule.startRecording();
        console.log('3. 마이크 시작 완료, 하트비트 시작');
        startHeartbeat();
        startCountdown();
        console.log('4️⃣. startAudioCall 완료');
      } catch (err) {
        console.error('❌ startAudioCall 실패:', err);
        setCallStatus(CallStatus.Idle);
      }
    });
  }, [startHeartbeat, startCountdown]);

  const handleDisconnect = useCallback(async () => {
    try {
      const response = await endAudioCall();
      console.log('✅ handleDisconnect 응답:', response);
      setCallStatus(CallStatus.End);
    } catch (err) {
      console.error('❌ endAudioCall 실패:', err);
    } finally {
      MyModule.stopRecording();
      MyModule.stopRealtimePlayback();
      stopHeartbeat();
      stopCountdown();
      setCallStatus(CallStatus.Idle);
    }
  }, [stopHeartbeat, stopCountdown]);

  const handlePause = useCallback(async () => {
    console.log('handlePause 호출', callStatus);
    try {
      const response = await pauseAudioCall();
      console.log('✅ pauseRecording 응답:', response);
      setCallStatus(CallStatus.Paused);
      MyModule.stopRecording();
      MyModule.pauseRealtimePlayback();
      stopCountdown();
    } catch (err) {
      console.error('❌ pauseRecording 실패:', err);
    }
  }, [stopCountdown]);

  const handleResume = useCallback(async () => {
    console.log('handleResume 호출');
    try {
      const response = await resumeAudioCall();
      console.log('✅ resumeRecording 응답:', response);
      if (typeof response.remainingTime === 'number') {
        console.log('handleResume 남은 시간 업데이트:', response.remainingTime, '초');
        setRemainingTime(response.remainingTime); // ✅ 상태 갱신 추가
      }
      setCallStatus(CallStatus.Resumed);
      startCountdown(); // 카운트다운 재시작
      console.log('⏳ 카운트다운 재시작');

      MyModule.startRecording();
      MyModule.resumeRealtimePlayback();
    } catch (err) {
      console.error('❌ resumeRecording 실패:', err);
    }
  }, [startCountdown]);

  useEffect(() => {
    return () => {
      console.log('🧨 useAudioCall 언마운트됨');
    };
  }, []);

  return [
    {
      waveform,
      wavFilePath,
      isAudioSessionActive,
      remainingTime,
      totalTime,
      responseText,
      callStatus,
    },
    {
      handleConnect,
      handleDisconnect,
      handlePause,
      handleResume,
    },
  ];
};
