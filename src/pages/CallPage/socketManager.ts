// socketManager.ts
import { io, Socket } from 'socket.io-client';
import float32ToInt16PCM from './float32ToInt16PCM'; // float32ToInt16PCM 함수 임포트
import MyModule from '../../../modules/my-module';
import useRef from 'react';

let socket: Socket | null = null;
let isPlaying = false;
let lastReceiveTime = Date.now();
let NEW_RESPONSE_GAP = 1000; // 1초 이상 뜸하면 새로운 응답으로 간주

export const initSocket = (token: string) => {
  console.log('🔹 initSocket called with token:', token);
  if (!socket) {
    socket = io('https://api.remind4u.co.kr', {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: false, // 자동 연결 비활성화
    });

    // 서버 이벤트 리스닝 - socket.on('이벤트명', 콜백) 형태로 서버에서 보내는 이벤트를 받을 수 있음
    socket.on('connect', () => {
      console.log('[SOCKET] 연결됨:', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('[SOCKET] 연결 끊김');
    });

    socket.on('connected', (data) => {
      console.log('[서버 응답]: ', data.message);
    });

    socket.on('disconnected', (data) => {
      console.log('[서버 응답]: ', data.message);
    });
    socket.on('pause', (data) => {
      console.log('[서버 응답]: ', data.message);
    });
    socket.on('resume', (data) => {
      console.log('[서버 응답]: ', data.message);
    });

    socket.on('connect_error', (err) => {
      console.error('[SOCKET] 연결 오류 발생');
      console.error('🔹 message:', err.message);
      console.error('🔹 name:', err.name);
      console.error('🔹 stack:', err.stack);
      console.error('🔹 details:', err); // 전체 객체 출력
    });
    // 서버로부터 오디오 응답 받기 (buf 는 100ms 분량 오디오 데이터가 담긴 ArrayBuffer)
    socket.on('gemini_audio', (buf) => {
      console.log('🧠 Gemini 응답 수신:', typeof buf, buf);

      const now = Date.now();
      const isNewResponse = now - lastReceiveTime > NEW_RESPONSE_GAP;
      lastReceiveTime = now;
      if (isNewResponse) {
        console.log('🆕 감지: 새로운 Gemini 응답 시작!');
        MyModule.clearQueue();
        MyModule.startPlaybackLoop();
      }
      const uint8 = new Uint8Array(buf);
      //console.log('1️⃣ [uint8 Samples]', uint8.slice(0, 10));
      const int16 = new Int16Array(
        uint8.buffer,
        uint8.byteOffset,
        uint8.byteLength / Int16Array.BYTES_PER_ELEMENT,
      );

      const bytes = new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength);
      //console.log('2️⃣ [Int16 Samples]', `[${[...int16].join(',')}]`);

      MyModule.playPCMBuffer(bytes);

      //console.log('isPlaying:', isPlaying);
      //MyModule.clearQueue(); // 큐 비우기
      //console.log('arraybuffer test', pcmArrayBuffer instanceof ArrayBuffer); // true 여야 함
      //MyModule.enqueuePCMData(pcmArrayBuffer);
      //MyModule.playNextChunk();
      /*if (!isPlaying) {
        //재생중이 아니면 큐에서 데이터를 꺼내서 재생합니다.
        console.log('▶️ 재생 시작');
        isPlaying = true;
        MyModule.playNextChunk();
      }*/
    });
  }

  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;

// 서버에 전송
/*export const sendMicAudio = (samples: number[]) => {
  const socket = getSocket();
  if (!socket || !socket.connected) return;

  const pcmBytes = float32ToInt16PCM(samples);
  socket.emit('mic_audio', pcmBytes); // 바로 전송
  console.log('📤 mic_audio emitted:', pcmBytes.byteLength, 'bytes');
};*/

// socketManager.ts
export const onGeminiResponse = (callback: (text: string) => void) => {
  const socket = getSocket();
  if (!socket) return;
};
