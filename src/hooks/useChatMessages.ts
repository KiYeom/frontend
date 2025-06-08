//채팅 데이터 관리 및 비즈니스 로직 담당
import { useState, useRef, useEffect, useCallback } from 'react';
import { IMessage, GiftedChat } from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import { chatting, getV3OldChatting } from '../apis/chatting';
import {
  getUserNickname,
  getNewIMessagesV3,
  setNewIMessagesV3,
  deleteNewIMessages,
  doesV3KeyExist,
} from '../utils/storageUtils';
import {
  ApiAnswerMessage,
  ApiChatResponse,
  ApiQuestionMessage,
  ExtendedIMessage,
} from '../utils/chatting';
import Toast from 'react-native-root-toast';
import Analytics from '../utils/analytics';
import { ERRORMESSAGE } from '../constants/Constants';
import { useSelectedEmoji } from './useSelectedEmoji';

interface UseChatMessagesProps {
  informalMode: boolean; // 반말 모드 여부
  onShowAdsModal: () => void; // 광고 모달을 띄우기 위한 콜백 함수
}

interface ChatMessageState {
  messages: ExtendedIMessage[];
  sending: boolean;
  buffer: string | null;
  image: string | null;
  setBuffer: React.Dispatch<React.SetStateAction<string | null>>;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  onSend: (newMessages: IMessage[]) => void;
  loadInitialMessages: () => Promise<void>;
  toggleFavorite: (messageId: string) => void;
  sendMessageToServer: () => Promise<void>;
}

// 유저와 챗봇 오브젝트 정의 (NewChat.tsx에서 가져옴)
const userObject = {
  _id: 0,
  name: '나',
};

const botObject = {
  _id: 1,
  name: '쿠키',
  avatar: require('../assets/images/cookieprofile.png'),
};
const systemObject = {
  _id: -1,
  name: 'system',
  avatar: null,
};

export const useChatMessages = ({
  informalMode,
  onShowAdsModal,
}: UseChatMessagesProps): ChatMessageState => {
  const [messages, setMessages] = useState<ExtendedIMessage[]>([]);
  const [sending, setSending] = useState<boolean>(false);
  const [buffer, setBuffer] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<string[]>([]); // To store all pending text messages
  const imageRef = useRef<string | null>(null); // 최신 image 값을 참조하기 위한 ref

  const { selectedEmoji, onSelectEmoji } = useSelectedEmoji();

  // buffer와 image 상태가 변경될 때마다 ref 업데이트
  // NOTE: bufferRef.current = buffer; was causing issues by being too tightly coupled with the state
  // We'll manage text messages via messageQueueRef directly.
  useEffect(() => {
    imageRef.current = image;
  }, [image]);

  // v3 메시지를 로컬에 저장하는 함수 (NewChat.tsx에서 가져옴)
  const setIMessagesV3Local = useCallback(
    (previousMessages: ExtendedIMessage[], newMsgs: ExtendedIMessage[]) => {
      const messagesString = JSON.stringify([...newMsgs, ...previousMessages]);
      setNewIMessagesV3(messagesString);
    },
    [],
  );

  // 서버로 메시지를 전송하고 응답을 처리하는 함수 (NewChat.tsx에서 가져옴)
  const sendMessageToServer = useCallback(async () => {
    console.log('sendMessageToServer 실행됨');
    // Only send if there are messages in the queue or an image
    if (messageQueueRef.current.length === 0 && !imageRef.current) {
      return;
    }

    // Capture the current queue and image to send
    const currentBufferToSend = messageQueueRef.current.join('\t'); // Join all accumulated messages
    const currentImageToSend = imageRef.current;

    // Clear the queue and image *before* sending to prevent duplicate sends on rapid clicks
    messageQueueRef.current = [];
    setImage(null); // Clear image state immediately
    imageRef.current = null;

    if (sending) {
      // Prevent multiple simultaneous API calls
      return;
    }

    setSending(true); // 전송 시작

    try {
      const isDemo = false; // 실제 값은 NewChat.tsx에서 주입되어야 함
      const res = await chatting(1, currentBufferToSend, isDemo, currentImageToSend ?? '');

      if (res) {
        const sortedMessages: ApiChatResponse = res?.reverse();
        const apiQuestions: ApiQuestionMessage[] = sortedMessages.filter(
          (item): item is ApiQuestionMessage =>
            item.question !== null && item.question !== '' && item.answer === null,
        );
        const apiAnswers: ApiAnswerMessage[] = sortedMessages.filter(
          (item): item is ApiAnswerMessage => item.answer !== null && item.question === null,
        );

        setMessages((previousMessages) => {
          const updatedMessages = [...previousMessages];

          // 보낸 메시지의 ID 업데이트:
          // API에서 받은 질문 메시지의 ID로, UI에 임시로 추가했던 메시지의 ID를 업데이트합니다.
          for (let i = 0; i < apiQuestions.length; i++) {
            const apiQuestion = apiQuestions[i];
            const questionId = apiQuestion.id;
            const questionText = apiQuestion.question || '';

            const existingMessageIndex = updatedMessages.findIndex(
              (msg) =>
                typeof msg._id === 'string' &&
                msg._id.startsWith('temp-') &&
                (msg.text === questionText || (msg.image && questionText.includes(msg.image))),
            );

            if (existingMessageIndex !== -1) {
              updatedMessages[existingMessageIndex] = {
                ...updatedMessages[existingMessageIndex],
                _id: questionId,
              };
            }
          }

          // 봇의 답변 메시지 생성
          const newBotMessages: ExtendedIMessage[] = apiAnswers.map((item) => ({
            _id: item.id,
            text: item.answer ?? '',
            createdAt: new Date(),
            user: botObject,
            isSaved: false,
          }));

          setIMessagesV3Local(updatedMessages, newBotMessages);
          return GiftedChat.append(updatedMessages, newBotMessages);
        });
      }
    } catch (err) {
      console.error('채팅 API 오류:', err);
      // 오류 메시지 UI에 표시
      const newErrorMessage: ExtendedIMessage = {
        _id: uuid.v4().toString(),
        text: ERRORMESSAGE,
        createdAt: new Date(),
        user: botObject,
        isSaved: false,
      };
      setMessages((previousMessages) => {
        setIMessagesV3Local(previousMessages, [newErrorMessage]);
        return GiftedChat.append(previousMessages, [newErrorMessage]);
      });
    } finally {
      setSending(false); // 전송 완료
    }
  }, [sending, setIMessagesV3Local]);

  // 디바운싱 타이머 관리 함수 (NewChat.tsx에서 가져옴)
  const resetTimer = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Only apply debouncing if there are text messages in the queue and no image
    if (messageQueueRef.current.length > 0 && !imageRef.current) {
      typingTimeoutRef.current = setTimeout(() => {
        sendMessageToServer();
      }, 2000); // 2초 후 전송
    }
  }, [sendMessageToServer]);

  // buffer가 변경될 때마다 타이머 재설정 (디바운싱)
  // This useEffect will now primarily react to messages being added to the queue
  useEffect(() => {
    if (messageQueueRef.current.length > 0) {
      resetTimer();
    }
  }, [messageQueueRef.current.length, resetTimer]); // Trigger on queue length change

  // 메시지 전송 (비행기 아이콘 클릭 시) 함수 (NewChat.tsx에서 가져옴)
  const onSend = useCallback(
    (newMsgs: IMessage[] = []) => {
      const messageToSend = newMsgs[0];

      // 텍스트도, 이미지도 없는 경우 전송하지 않음
      if (!messageToSend?.text?.trim() && !messageToSend?.image) {
        return;
      }
      Analytics.clickChatSendButton(); // 분석 이벤트 전송

      // UI에 즉시 메시지 추가 (임시 ID 사용)
      const tempMessage: ExtendedIMessage = {
        ...messageToSend,
        _id: `temp-${uuid.v4().toString()}`, // 임시 ID 부여
        user: userObject,
        createdAt: new Date(),
        isSaved: false,
      };

      setMessages((prev) => GiftedChat.append(prev, [tempMessage]));

      // If an image is selected
      if (imageRef.current) {
        if (messageToSend.text) {
          // If there's text with the image, add it to the queue as well
          messageQueueRef.current.push(messageToSend.text);
        }
        onShowAdsModal(); // Request to show the ad modal
        // sendMessageToServer will be called after ad success
        //sendMessageToServer();
      } else {
        // Only text message
        messageQueueRef.current.push(messageToSend.text || ''); // Add text to the queue
        // The useEffect for messageQueueRef.current.length will trigger resetTimer
      }
      setBuffer(null); // Clear the input buffer after sending, but not the actual message queue
    },
    [onShowAdsModal],
  );

  // 과거 대화 기록을 불러오는 함수 (NewChat.tsx에서 가져옴)
  const loadInitialMessages = useCallback(async () => {
    setMessages([]); // 기존 메시지 모두 지우기
    try {
      let loadedMessages: ExtendedIMessage[] = [];
      const isV3KeyExist = doesV3KeyExist(); // v3 키 존재 여부 확인

      if (!isV3KeyExist) {
        // v3 키가 존재하지 않는 경우 (로그아웃 후 또는 첫 실행)
        const v3lastMessageDate = new Date(0); // 모든 기록 가져오기
        const v3ServerMessages = await getV3OldChatting(
          botObject._id,
          v3lastMessageDate.toISOString(),
        );

        if (v3ServerMessages && v3ServerMessages.chats && v3ServerMessages.chats.length > 0) {
          // 서버에서 가져온 v3 데이터를 ExtendedIMessage 형식으로 변환
          const serverMessagesFormatted: ExtendedIMessage[] = v3ServerMessages.chats.map(
            (chat) => ({
              _id: chat.id,
              text: chat.text || '',
              image: chat.id.includes('-PIC') ? chat.text : undefined, // '-PIC'이 포함된 ID는 이미지 URL로 간주
              createdAt: new Date(chat.utcTime),
              user: chat.status === 'user' ? userObject : botObject,
              isSaved: chat.isSaved,
              hightlightKeyword: '',
              system: false, // 시스템 메시지가 아님
            }),
          );
          loadedMessages.push(...serverMessagesFormatted.reverse()); // 최신 메시지가 위로 오도록 reverse
          setNewIMessagesV3(JSON.stringify(loadedMessages)); // 로컬에 저장
          deleteNewIMessages(); // v3 이전 로컬 데이터 삭제 (필요하다면)
        } else {
          // 서버에도 기록이 없는 완전 새로운 사용자
          const userNickname = getUserNickname() ?? '친구'; // 기본값 설정
          const systemMessage = {
            _id: 'systemMessage',
            text: `이 곳은 ${userNickname}님과 저만의 비밀 공간이니, 어떤 이야기도 편하게 나눠주세요!\n\n반말로 대화를 나누고 싶으시다면 위에서 오른쪽에 있는 탭 바를 열고, 반말 모드를 켜 주세요!🍀💕`,
            createdAt: new Date(),
            user: systemObject,
            isSaved: false,
            hightlightKeyword: '',
            system: true,
          };
          const welcomeMessage = {
            _id: 'welcomeMessage',
            text: informalMode
              ? `반가워, ${userNickname}!💚 나는 ${userNickname}님 곁에서 힘이 되고싶은 골든 리트리버 쿠키야🐶 오늘은 어떤 하루를 보냈어?`
              : `반가워요, ${userNickname}님!💚 저는 ${userNickname}님 곁에서 힘이 되어드리고 싶은 골든 리트리버 쿠키예요🐶 오늘은 어떤 하루를 보내셨나요?`,
            createdAt: new Date(),
            user: botObject,
            isSaved: false,
            hightlightKeyword: '',
            showAvatar: true,
            system: false,
          };
          loadedMessages.push(welcomeMessage, systemMessage);
          setNewIMessagesV3(JSON.stringify(loadedMessages)); // 로컬에 새로운 초기 메시지 저장
        }
      } else {
        // v3 키가 존재하는 경우 (이미 마이그레이션되었거나 v3로 시작한 사용자)
        const v3DeviceHistory = getNewIMessagesV3();
        if (v3DeviceHistory) {
          loadedMessages.push(...JSON.parse(v3DeviceHistory));
        }

        // 로컬에 있는 가장 오래된 메시지 시간 이후의 서버 메시지 가져오기
        const v3lastMessageDate: Date =
          loadedMessages.length > 0 ? new Date(loadedMessages[0].createdAt) : new Date(0);
        const v3ServerMessages = await getV3OldChatting(
          botObject._id,
          v3lastMessageDate.toISOString(),
        );

        if (v3ServerMessages && v3ServerMessages.chats && v3ServerMessages.chats.length > 0) {
          const serverMessagesFormatted: ExtendedIMessage[] = v3ServerMessages.chats.map(
            (chat) => ({
              _id: chat.id,
              text: chat.text || '',
              image: chat.id.includes('-PIC') ? chat.text : undefined,
              createdAt: new Date(chat.utcTime),
              user: chat.status === 'user' ? userObject : botObject,
              isSaved: chat.isSaved,
              hightlightKeyword: '',
              system: false,
            }),
          );
          loadedMessages = [...serverMessagesFormatted.reverse(), ...loadedMessages]; // 서버 메시지를 기존 메시지 앞에 추가
          setNewIMessagesV3(JSON.stringify(loadedMessages)); // 업데이트된 메시지 로컬에 저장
        }
      }
      setMessages(loadedMessages); // 메시지 상태 업데이트
    } catch (error) {
      //console.error('채팅 기록 로드 실패:', error);
      console.log('채팅 기록 실패', error);
      Toast.show('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.', {
        duration: Toast.durations.LONG,
      });
      //navigation.navigate(TabScreenName.Home); // NewChat.tsx에서 처리
    }
  }, [informalMode, setIMessagesV3Local]); // informalMode와 setIMessagesV3Local를 의존성 배열에 추가

  // 즐겨찾기 토글 함수 (NewChat.tsx에서 가져옴)
  /*const toggleFavorite = useCallback(
    (messageId: string) => {
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((m) =>
          m._id === messageId ? { ...m, isSaved: !m.isSaved } : m,
        );
        setIMessagesV3Local(updatedMessages, []); // 로컬 저장소에도 업데이트
        // TODO: 서버에 즐겨찾기 상태 변경을 보고하는 API 호출 추가 (reportMessages 함수 사용)
        // const targetMessage = messages.find((m) => m._id === messageId);
        // if (targetMessage) { reportMessages(messageId, targetMessage.isSaved); }
        return updatedMessages;
      });
    },
    [setIMessagesV3Local],
  );*/

  const toggleFavorite = () => {
    console.log('즐겨찾기 토글 ');
  };

  return {
    messages,
    sending,
    buffer,
    image,
    setBuffer,
    setImage,
    onSend,
    loadInitialMessages,
    toggleFavorite,
    sendMessageToServer,
  };
};
