import * as Sentry from '@sentry/react-native';
import {
  TChatAnswer,
  TFavoriteChat,
  TOldAnswer,
  TChatAnswerV3,
  TChatSearchResult,
  TChatSendPhotoPermission,
} from './chatting.types';
import { Platform } from 'react-native';
import { uriToBlob } from '../utils/chatting';
import { instance } from './interceptor';

const errorMessage: TChatAnswerV3 = [
  {
    answer: '너무 죄송하지만 다시 한 번 말해줄 수 있나요?🥺🐶',
    id: 'error',
    question: null,
  },
];

export const updateSendPhotoPermission = async (
  canSendPhoto: boolean,
): Promise<TChatSendPhotoPermission | undefined> => {
  try {
    const res = await instance.patch('/v1/users/update-sendphoto', { canSendPhoto });
    return res.data;
  } catch (error) {
    console.log('updateSendPhotoPermission error', error);
    return;
  }
};

export const chatting = async (
  characterId: number,
  question: string,
  isDemo: boolean = false,
  image?: string,
): Promise<TChatAnswerV3 | undefined> => {
  const maxAttempts = 3;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      attempts++;

      if (image) {
        const formData = new FormData();
        formData.append('characterId', characterId.toString());
        formData.append('question', question);
        formData.append('isDemo', isDemo ? 'true' : 'false');

        const filename = image.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const fileExtension = match ? match[1].toLowerCase() : 'jpg';
        const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

        // Correct URI handling for Android
        let correctedUri = image;
        if (Platform.OS === 'android' && !image.startsWith('file://')) {
          correctedUri = `file://${image}`;
        }

        const fileObj = {
          uri: correctedUri,
          name: filename,
          type: mimeType,
        };

        //console.log('Processing image:', fileObj);
        formData.append('image', fileObj as any);

        // Let Axios handle content-type and boundary automatically
        const res = await instance.post('/v3/chat/memory', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
      } else {
        const res = await instance.post('/v3/chat/memory', {
          characterId,
          question,
          isDemo,
        });
        return res.data;
      }
    } catch (error) {
      console.log(`Attempt ${attempts} failed:`, error);

      if (attempts >= maxAttempts) {
        throw error;
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
    //console.log('💚💚💚💚💚💚', res.data);
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
    //return res.data;
    ///return dummyData;
  } catch (error) {
    //console.log('getFavoriteChat error', error);
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
    //console.log(error);
    return;
  }
};

//1.5.7 UPDATE 신규 - 좋아하는 대화 저장하기 (이상함)
export const saveFavoriteChatLog = async (
  messageId: string,
  isSaved: boolean,
): Promise<boolean> => {
  //console.log('messageId', messageId);
  //console.log('isSaved', isSaved);
  //console.log(JSON.stringify({ messageId, isSaved }));
  try {
    const res = await instance.post('/v3/chat/favorite', null, {
      params: { messageId, isSaved },
    });
    //console.log('대화 저장 형식 : ', isSaved);
    //console.log('대화 저장 결과', res.data);
    return res.data;
  } catch (error) {
    //console.log('saveFavoriteChat error', error);
    return false;
  }
};

//1.5.7 UPDATE 신규 - 대화 삭제하기
export const deleteChatLog = async (): Promise<boolean> => {
  try {
    const res = await instance.delete('/v3/chat/init');
    return res.data;
  } catch (error) {
    //console.log('deleteChatLog error', error);
    return false;
  }
};

//1.5.7 UPDATE 신규 - 대화 검색하기
export const searchChatWord = async (
  searchWord: string,
  nowCursor: string | null,
  direction: 'up' | 'down' | null,
): Promise<TChatSearchResult | undefined> => {
  try {
    const res = await instance.get('/v3/chat/search', {
      params: { searchWord, nowCursor, direction },
    });
    //console.log('searchChatWord params', searchWord);
    //console.log('searchChatWord result', res.data);
    return res.data;
  } catch (error) {
    //console.log('searchChatWord error 발생', error);
    return;
  }
};
