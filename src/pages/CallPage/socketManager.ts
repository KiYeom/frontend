// socketManager.ts
import { io, Socket } from 'socket.io-client';
import float32ToInt16PCM from './float32ToInt16PCM'; // float32ToInt16PCM 함수 임포트

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  console.log('🔹 initSocket called with token:', token);
  if (!socket) {
    socket = io('https://api.remind4u.co.kr', {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: false, // 자동 연결 비활성화
    });

    // 이벤트 핸들링 예시
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
export const sendMicAudio = (samples: number[]) => {
  const socket = getSocket();
  if (!socket || !socket.connected) return;

  const pcmBytes = float32ToInt16PCM(samples);
  socket.emit('mic_audio', pcmBytes); // 바로 전송
  console.log('📤 mic_audio emitted:', pcmBytes.byteLength, 'bytes');
};

// socketManager.ts
export const onGeminiResponse = (callback: (text: string) => void) => {
  const socket = getSocket();
  if (!socket) return;

  socket.on('gemini_audio', (buf) => {
    console.log('🧠 Gemini 응답 수신:', buf);
    const text = new TextDecoder().decode(buf);
    callback(text);
  });
};
