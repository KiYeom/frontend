// socketManager.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  console.log('🔹 initSocket called with token:', token);
  if (!socket) {
    socket = io('https://api.remind4u.co.kr', {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    // 이벤트 핸들링 예시
    socket.on('connect', () => {
      console.log('[SOCKET] 연결됨:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('[SOCKET] 연결 끊김');
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
