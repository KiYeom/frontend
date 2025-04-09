import { IMessage } from 'react-native-gifted-chat';
//1.5.7 UPDATE : IMessage 타입 확장
export interface ExtendedIMessage extends IMessage {
  isSaved?: boolean;
  hightlightKeyword?: string;
}
