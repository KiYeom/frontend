import * as Sentry from '@sentry/react-native';
import { TChatAnswer, TOldAnswer } from './chatting.types';
import { instance } from './interceptor';

export const chatting = async (
  characterId: number,
  question: string,
  isDemo: boolean = false,
): Promise<TChatAnswer | undefined> => {
  try {
    const res = await instance.post('/v1/chat/memory', {
      characterId,
      question,
      isDemo,
    });
    return res.data; //ai의 답변을 return
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        screen: 'chatting',
        action: 'ai의 답변을 받는 과정 (post /v1/chat/memory)',
        time: new Date().toISOString(),
        apiEndPoinnt: '/v1/chat/memory',
      },
    }); // Sentry에 에러 전송
    return;
  }
};

export const getOldChatting = async (
  characterId: number,
  from: string,
): Promise<TOldAnswer | undefined> => {
  try {
    const res = await instance.get('/v1/chat/history', {
      params: { 'character-id': characterId, from },
    });
    return res.data;
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        screen: 'chatting',
        action: '이전 데이터들을 가지고 오는 작업 (get /v1/chat/history)',
        time: new Date().toISOString(),
        apiEndPoinnt: '/v1/chat/history',
      },
    });
    return;
  }
};

export const reportChat = async (
  botId: number,
  userText: string,
  botText: string,
  chatTime: string,
): Promise<boolean> => {
  try {
    await instance.post('/v1/chat/report', { botId, userText, botText, chatTime });
    return true;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
};
