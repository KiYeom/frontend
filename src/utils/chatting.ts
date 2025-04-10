import { IMessage } from 'react-native-gifted-chat';
//1.5.7 UPDATE : IMessage 타입 확장
export interface ExtendedIMessage extends IMessage {
  isSaved?: boolean;
  hightlightKeyword?: string;
}

// 파일 URI를 Blob으로 변환하는 함수
export const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return await response.blob();
};
