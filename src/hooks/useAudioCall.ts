// hooks/useAudioCall.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { EventEmitter } from 'expo-modules-core';
import MyModule from '../../modules/my-module';
import { getAccessToken } from '../utils/storageUtils';
import { initSocket, getSocket } from '../pages/voice/socketManager';
import { setTextReceiveHandler } from '../pages/voice/socketManager';
import { getUserNickname } from '../utils/storageUtils';
import {
  endAudioCall,
  pauseAudioCall,
  resumeAudioCall,
  startAudioCall,
  heartbeatAudioCall,
  getRemainingTime,
} from '@apis/voice';

export enum CallStatus {
  Idle = 'idle',
  Start = 'start',
  Paused = 'pause',
  Resumed = 'resume',
  End = 'end',
  Active = 'acrtive',
  CONNECTING = 'connecting',
  ERROR = 'error',
}

const userNickname = getUserNickname(); // 사용자 닉네임 가져오기
// 상태별 기본 메시지 상수
const STATUS_MESSAGES = {
  [CallStatus.Idle]: `찾아와줘서 고마워요${userNickname ? `, ${userNickname}님` : ''}\n마음 속의 생각을 편하게 이야기 해 주세요`,
  [CallStatus.Start]: '쿠키가 듣고 있어요',
  [CallStatus.Paused]: '잠시 멈췄어요. 준비되면 다시 시작해주세요',
  [CallStatus.Resumed]: '다시 들을게요',
  [CallStatus.End]: '다음에 또 이야기해요 😊',
  [CallStatus.CONNECTING]: '연결 중이에요...',
  [CallStatus.ERROR]: '연결에 실패했어요. 다시 시도해주세요',
};

interface AudioCallState {
  waveform: number[];
  wavFilePath: string | null;
  isAudioSessionActive: boolean;
  remainingTime: number;
  totalTime: number;
  responseText: string;
  callStatus: CallStatus;
  volumeLevel: number; // 볼륨 레벨 추가
  speakerVolume: number; // 상대방 볼륨 추가
}

interface AudioCallHandlers {
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handlePause: () => Promise<void>;
  handleResume: () => Promise<void>;
  setTotalTime: (seconds: number) => void;
  setRemainingTime: (seconds: number) => void;
}

const GAIN_CORRECTION = 20; // 실험적으로 조정, 10~25 정도
const THRESHOLD = 0.00015; // 0.0001~0.0002
export const useAudioCall = (): [AudioCallState, AudioCallHandlers] => {
  // State
  const [waveform, setWaveform] = useState<number[]>([]);
  const [wavFilePath, setWavFilePath] = useState<string | null>(null);
  const [isAudioSessionActive, setIsAudioSessionActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [responseText, setResponseText] = useState<string>('');
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.Idle);
  //볼륨 상태
  const [volumeLevel, setVolumeLevel] = useState<number>(0); //나의 볼륨
  const [speakerVolume, setSpeakerVolume] = useState<number>(0); //상대방 (쿠키) 볼륨

  // 볼륨 계산 함수
  function calculateVolume(pcm: Uint8Array): number {
    if (pcm.length < 2) return 0;

    const view = new DataView(pcm.buffer);
    let sumSquares = 0;
    const sampleCount = pcm.length / 2;

    for (let i = 0; i < pcm.length; i += 2) {
      const sample = view.getInt16(i, true); // 리틀엔디안
      sumSquares += sample * sample;
    }

    const rms = Math.sqrt(sumSquares / sampleCount);
    const normalized = rms / 32768; // Int16 max value
    const boosted = normalized * GAIN_CORRECTION;
    return boosted < THRESHOLD ? 0 : Math.min(boosted, 1);
    //return Math.min(normalized, 1); // 0~1로 정규화
  }

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

  /** 텍스트 수신시마다 최신 문장으로 교체 (원하면 누적도 가능) */
  useEffect(() => {
    console.log('🔹 텍스트 수신 핸들러 설정');
    setTextReceiveHandler((text) => {
      setResponseText(text); // 🔹 “교체” 방식
      // setResponseText((prev) => prev + '\n' + text); // ← “누적”이 필요하면 이 줄로
    });
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
      console.log('🔊 오디오 버퍼 이벤트 수신:', normalized);
    });

    // PCM 전송용
    const micSub = emitter.addListener('onMicAudio', ({ pcm }) => {
      const socket = getSocket();
      if (socket && socket.connected) {
        const payload = new Uint8Array(pcm);
        socket.emit('mic_audio', payload);

        // 1. 볼륨 계산
        const uint8 = new Uint8Array(pcm);
        const volume = calculateVolume(uint8);
        //console.log('volume', volume);
        setVolumeLevel(volume);
      } else {
        console.log('❌ 소켓이 연결되지 않았습니다. mic_audio 전송 실패');
      }
    });

    //파형 받기
    /*emitter.addListener('onPlaybackFrame', ({ level }) => {
      console.log('🔈 Playback volume:', level);
      //setSpeakerVolume(volume); // 시각화 용도로 전달
    });*/

    // 파일 경로 받기
    /*const fileListener = emitter.addListener('onRecordingSaved', ({ filePath }) => {
      console.log('📁 WAV 파일 저장됨:', filePath);
      setWavFilePath(filePath);
    });*/

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
      //fileListener.remove();
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
        //console.log('💓 Heartbeat 응답:', data);
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
  //useEffect(() => {
  //console.log('남은 시간 변화 : ', remainingTime, '초');
  //}, [remainingTime]);

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
      //console.log('⏲️ 카운트다운 tick');
      setRemainingTime((prev) => {
        const next = Math.max(prev - 1, 0); //테스트 : 10초씩 감소
        //console.log('🕐 remainingTime 업데이트:', prev, '→', next);
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
    setCallStatus(CallStatus.CONNECTING);
    setResponseText(STATUS_MESSAGES[CallStatus.CONNECTING]); //연결 중이에요...
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
        setResponseText(STATUS_MESSAGES[CallStatus.Start]); // 쿠키가 듣고 있어요
      } catch (err) {
        console.error('❌ startAudioCall 실패:', err);
        setCallStatus(CallStatus.Idle);
        setResponseText(STATUS_MESSAGES[CallStatus.ERROR]); // 연결에 실패했어요. 다시 시도해주세요
      }
    });
  }, [startHeartbeat, startCountdown]);

  const handleDisconnect = useCallback(async () => {
    try {
      const response = await endAudioCall();
      console.log('✅ handleDisconnect 응답:', response);
      setCallStatus(CallStatus.End);
      setResponseText(STATUS_MESSAGES[CallStatus.End]); // 다음에 또 이야기해요 😊
    } catch (err) {
      console.error('❌ endAudioCall 실패:', err);
      setResponseText(STATUS_MESSAGES[CallStatus.ERROR]); // 연결에 실패했어요. 다시 시도해주세요
    } finally {
      MyModule.stopRecording();
      MyModule.stopRealtimePlayback();
      stopHeartbeat();
      stopCountdown();
      setCallStatus(CallStatus.Idle); // 상태 초기화
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
      MyModule.resumeRealtimePlayback();
      //MyModule.startRecording();
      // 플랫폼별 처리
      if (Platform.OS === 'ios') {
        // iOS는 마이크 수동 시작 필요
        MyModule.startRecording();
        MyModule.resumeRealtimePlayback();
      } else {
        // Android는 자동 제어에 맡김
        MyModule.resumeRealtimePlayback();
      }
    } catch (err) {
      console.error('❌ resumeRecording 실패:', err);
    }
  }, [startCountdown]);

  useEffect(() => {
    return () => {
      console.log('🧨 useAudioCall 언마운트됨');
      stopCountdown(); // 이 부분 추가
      stopHeartbeat(); // 이 부분도 추가
    };
  }, [stopCountdown, stopHeartbeat]);

  return [
    {
      waveform,
      wavFilePath,
      isAudioSessionActive,
      remainingTime,
      totalTime,
      responseText,
      callStatus,
      volumeLevel, // 볼륨 레벨 추가
      speakerVolume, // 상대방 볼륨 추가
    },
    {
      handleConnect,
      handleDisconnect,
      handlePause,
      handleResume,
      setTotalTime,
      setRemainingTime,
    },
  ];
};
