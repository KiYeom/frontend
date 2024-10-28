import * as Sentry from '@sentry/react-native';
import { TChatAnswer } from './chatting.types';
import { instance } from './interceptor';

export const chatting = async (
  characterId: number,
  question: string,
): Promise<TChatAnswer | undefined> => {
  //console.log('chatting api 호출!!!', question);
  try {
    const res = await instance.post('/v1/chat/memory', {
      characterId,
      question,
    });
    return res.data; //ai의 답변을 return
  } catch (error) {
    Sentry.captureException(error); // Sentry에 에러 전송
    console.log('ERRORMESSAGE', error);
    return;
  }
};
