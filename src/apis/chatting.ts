import { ERRORMESSAGE } from '../constants/Constants';
import { TChatAnswer } from './chatting.types';
import { instance } from './interceptor';

export const chatting = async (characterId: number, question: string): Promise<TChatAnswer> => {
  try {
    const res = await instance.post('/v1/chat', {
      characterId,
      question,
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] chatting', error);
    return {
      answer: ERRORMESSAGE,
    };
  }
};
