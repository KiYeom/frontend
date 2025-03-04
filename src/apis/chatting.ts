import * as Sentry from '@sentry/react-native';
import { TChatAnswer, TOldAnswer } from './chatting.types';
import { instance } from './interceptor';

const errorMessage: TChatAnswer = {
  answer: '너무 죄송하지만 다시 한 번 말해줄 수 있나요?🥺🐶',
};

export const chatting = async (
  characterId: number,
  question: string,
  isDemo: boolean = false,
): Promise<TChatAnswer | undefined> => {
  let attempts = 0;
  while (attempts < 3) {
    try {
      attempts++;
      const res = await instance.post('/v1/chat/memory', {
        characterId,
        question: ' '.repeat(attempts - 1) + question,
        isDemo,
      });
      return res.data; //ai의 답변을 return
    } catch (error) {
      //Sentry.captureMessage(`실패 : ${attempts}번째 실패`);
      if (attempts >= 3) {
        //Sentry.captureMessage(`최종 실패 : ${attempts}번째 실패`);
        //Sentry.captureException(error); // Sentry에 에러 전송
        return errorMessage;
      }
    }
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
