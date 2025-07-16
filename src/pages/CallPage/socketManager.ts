// socketManager.ts
import { io, Socket } from 'socket.io-client';
import MyModule from '../../../modules/my-module';

let socket: Socket | null = null;
let lastReceiveTime = Date.now();
let NEW_RESPONSE_GAP = 1000; // 1초 이상 뜸하면 새로운 응답으로 간주

let onAudioReceive: (() => void) | null = null;
let onTextReceive: ((t: string) => void) | null = null; // 🔹 추가

export const setAudioReceiveHandler = (callback: () => void) => {
  onAudioReceive = callback;
};
export const setTextReceiveHandler = (cb: (t: string) => void) => {
  onTextReceive = cb;
}; // 🔹 추가

export const initSocket = (token: string) => {
  console.log('🔹 initSocket called with token:', token);

  if (!socket || !socket.connected) {
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
      socket?.disconnect();
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
      //console.log('🧠 Gemini 응답 수신:', typeof buf, buf);

      const now = Date.now();
      const isNewResponse = now - lastReceiveTime > NEW_RESPONSE_GAP;
      lastReceiveTime = now;
      if (isNewResponse) {
        console.log('🆕 감지: 새로운 Gemini 응답 시작!');
        MyModule.clearQueue();
        MyModule.startRealtimePlayback();

        // 🔹 500ms 무음 추가 (24kHz, 16bit PCM)
        const silenceSamples = 24000 * 0.5; //
        const silenceBuffer = new Uint8Array(silenceSamples * 2); // 16bit = 2 bytes
        MyModule.playPCMBuffer(silenceBuffer);
      }
      const uint8 = new Uint8Array(buf);
      //console.log('1️⃣ [uint8 Samples]', uint8.slice(0, 10));
      const int16 = new Int16Array(
        uint8.buffer,
        uint8.byteOffset,
        uint8.byteLength / Int16Array.BYTES_PER_ELEMENT,
      );

      const bytes = new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength);

      MyModule.playPCMBuffer(bytes);

      // ✅ 음성 수신 감지 트리거
      onAudioReceive?.();
    });
    //오디오 텍스트 응답
    socket.on('gemini_text', (data) => {
      console.log('[서버 응답]', data.message);
      onTextReceive?.(data.message); // 🔹 추가
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
