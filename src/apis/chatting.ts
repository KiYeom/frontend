import * as Sentry from '@sentry/react-native';
import { TChatAnswer, TFavoriteChat, TOldAnswer, TChatAnswerV3 } from './chatting.types';
import { instance } from './interceptor';

const errorMessage: TChatAnswerV3 = [
  {
    answer: '너무 죄송하지만 다시 한 번 말해줄 수 있나요?🥺🐶',
    id: 'error',
    question: null,
  },
];

export const chatting = async (
  characterId: number,
  question: string,
  isDemo: boolean = false,
): Promise<TChatAnswerV3 | undefined> => {
  let attempts = 0;
  while (attempts < 3) {
    try {
      attempts++;
      const res = await instance.post('/v3/chat/memory', {
        characterId,
        question: ' '.repeat(attempts - 1) + question,
        isDemo,
      });
      return res.data; //나의 질문쌍과 ai의 대답쌍을 한 번에 리턴
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
    console.log('💚💚💚💚💚💚', res.data);
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

//1.5.7 UPDATE : 내가 저장한 대화 내역 가지고 오기
export const getFavoriteChat = async (): Promise<TFavoriteChat | undefined> => {
  try {
    const res = await instance.get('/v3/chat/favorite');
    //console.log('💚💚💚💚💚💚', res.data);
    return res.data;
  } catch (error) {
    console.log('getFavoriteChat error', error);
    return;
  }
};
//1.5.7 UPDATE 신규 - 옛날 대화 내역 가지고 오기
export const getV3OldChatting = async (
  characterId: number,
  from: string,
): Promise<TOldAnswer | undefined> => {
  try {
    const res = await instance.get('/v3/chat/history', {
      params: { characterId, from },
    });
    //console.log('🥵🥵🥵🥵🥵🥵 getV3OldChatting', res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return;
  }
};
