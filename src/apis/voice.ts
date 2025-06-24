import * as Sentry from '@sentry/react-native';
import { instance } from './interceptor';

type AudioCallResponse = {
  remainingTime: number;
  status: 'start' | 'pause' | 'resume' | 'end' | 'active';
  action: null | 'end_call' | 'timeout'; // 비정상 종료 처리
};

export const startAudioCall = async (): Promise<AudioCallResponse> => {
  try {
    const data = await instance.post('/v1/audio/start');
    console.log('🔹 startAudioCall response:', data);
    return data;
  } catch (error) {
    console.log('🔹 startAudioCall error:', error);
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

//음성 통화 종료하기 (POST, /v1/audio/end)
export const endAudioCall = async (): Promise<AudioCallResponse> => {
  try {
    const response = await instance.post('/v1/audio/end');
    console.log('🔹 endAudioCall response:', response.data);
    return response.data;
  } catch (error) {
    //Sentry.captureException(error);
    console.log('🔹 endAudioCall error:', error);
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
