import * as Sentry from '@sentry/react-native';
import {
  TChatAnswer,
  TFavoriteChat,
  TOldAnswer,
  TChatAnswerV3,
  TChatSearchResult,
  TChatSendPhotoPermission,
} from './chatting.types';
import { Platform, Image } from 'react-native';
import { uriToBlob } from '../utils/chatting';
import { instance } from './interceptor';
import * as FileSystem from 'expo-file-system';

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
    //console.log('updateSendPhotoPermission error', error);
    return;
  }
};

export const chatting = async (
  characterId: number,
  question: string,
  isDemo: boolean = false,
  image?: string,
  isSticker?: boolean,
): Promise<TChatAnswerV3 | undefined> => {
  console.log('chatting', characterId, question, isDemo, image, isSticker);
  const maxAttempts = 3;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      attempts++;

      if (image) {
        //파일 데이터 생성
        const formData = new FormData();
        //텍스트 필드 (characterId, question, isDemo, isSticker) 추가
        formData.append('characterId', characterId.toString());
        formData.append('question', question);
        formData.append('isDemo', isDemo ? 'true' : 'false');
        if (isSticker) {
          formData.append('isSticker', 'true');
        }

        //파일명 추출
        const filename = image.split('/').pop() || 'image.jpg';
        //확장자 추출 : 이미지 URL에서 확장자를 추출하여 소문자로 변환하고, 없으면 'jpg'로 기본 설정
        const match = /\.(\w+)$/.exec(filename);
        const fileExtension = match ? match[1].toLowerCase() : 'jpg';
        //MIME 타입 설정 : jpg는 jpeg로 변환, 그 외에는 그대로 사용
        const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

        // Correct URI handling for Android
        let correctedUri = image;
        if (Platform.OS === 'android' && !image.startsWith('file://')) {
          correctedUri = `file://${image}`;
        }

        //서버로 전송될 파일 객체
        const fileObj = {
          uri: correctedUri, //로컬 파일 시스템 상의 이미지 경로
          name: filename, //서버에 전달될 파일명
          type: mimeType, //파일의 MIME 타입
        };

        //console.log('Processing image:', fileObj);
        formData.append('image', fileObj as any);

        // Let Axios handle content-type and boundary automatically
        const res = await instance.post('/v3/chat/memory', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
      } else {
        console.log('🧞‍♂️🧞‍♂️🧞‍♂️🧞‍♂️🧞‍♂️🧞‍♂️🧞‍♂️isSticker 여부', isSticker);
        const res = await instance.post('/v3/chat/memory', {
          characterId,
          question,
          isDemo,
        });
        return res.data;
      }
    } catch (error) {
      //console.log(`Attempt ${attempts} failed:`, error);

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
