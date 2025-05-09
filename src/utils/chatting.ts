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

//서버에서 반환되는 메세지 항목의 기본 인터페이스
export interface ChatMessageItem {
  id: string;
  question: string | null;
  answer: string | null;
}

//API 응답에서 필터링된 질문 메세지 타입
export type ApiQuestionMessage = ChatMessageItem & {
  question: string;
  answer: null;
};

//API 응답에서 필터링된 답변 메세지 타입
export type ApiAnswerMessage = ChatMessageItem & {
  answer: string;
  question: null;
};

// 전체 API 응답 타입
export type ApiChatResponse = ChatMessageItem[];

//필터링된 결과 타입
export type ApiQuestions = ApiQuestionMessage[];
export type ApiAnswers = ApiAnswerMessage[];
