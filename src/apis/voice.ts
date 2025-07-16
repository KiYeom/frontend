import * as Sentry from '@sentry/react-native';
import { instance } from './interceptor';

type AudioCallResponse = {
  remainingTime: number;
  status: 'start' | 'paused' | 'resumed' | 'end' | 'active';
  action: null | 'end_call' | 'timeout'; // 비정상 종료 처리
};

export const startAudioCall = async (): Promise<AudioCallResponse> => {
  try {
    const response = await instance.post('/v1/audio/start');
    //console.log('🔹 startAudioCall response:', data);
    return response.data;
  } catch (error) {
    //console.log('🔹 startAudioCall error:', error);
    throw error;
  }
};

//음성 통화 중지하기 (POST, /v1/audio/pause)
export const pauseAudioCall = async (): Promise<AudioCallResponse> => {
  try {
    const response = await instance.post('/v1/audio/pause');
    return response.data;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

//음성 통화 재개하기 (POST, /v1/audio/resume)
export const resumeAudioCall = async (): Promise<AudioCallResponse> => {
  try {
    const response = await instance.post('/v1/audio/resume');
    return response.data;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

//음성 통화 종료하기 (POST, /v1/audio/end)
export const endAudioCall = async (): Promise<AudioCallResponse> => {
  try {
    const response = await instance.post('/v1/audio/end');
    //console.log('🔹 endAudioCall response:', response.data);
    return response.data;
  } catch (error) {
    //Sentry.captureException(error);
    //console.log('🔹 endAudioCall error:', error);
    throw error;
  }
};

//음성통화 하트비트 (POST, /v1/audio/heartbeat)
export const heartbeatAudioCall = async (): Promise<AudioCallResponse> => {
  try {
    const response = await instance.post('/v1/audio/heartbeat');
    return response.data;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

//사용자 전체 음성 통화 시간 조회 (get, /v1/users/remaining-time)
export const getRemainingTime = async (): Promise<{ remainingTime: number }> => {
  try {
    const response = await instance.get('/v1/users/remaining-time');
    return response.data;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
