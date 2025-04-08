import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, SendProps } from 'react-native-gifted-chat';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/header/header';
import * as WebBrowser from 'expo-web-browser';
import {
  DANGER_LETTER,
  DangerStackName,
  ERRORMESSAGE,
  HomeStackName,
  RISK_SCORE_THRESHOLD,
  RootStackName,
} from '../../../constants/Constants';
import * as NavigationBar from 'expo-navigation-bar';
import { setRefreshChat } from '../../../utils/storageUtils';
import {
  addRefreshChat,
  deleteNewIMessages,
  deleteNewIMessagesV3,
  getIsDemo,
  getNewIMessages,
  getRefreshChat,
  getRiskData,
  getUserNickname,
  setIsScoreDemo,
  setNewIMessages,
  setNewIMessagesV3,
  setRiskData,
} from '../../../utils/storageUtils';
import Analytics from '../../../utils/analytics';
import { rsFont, rsWidth } from '../../../utils/responsive-size';
import { chatting, getOldChatting } from '../../../apis/chatting';
import { TabScreenName } from '../../../constants/Constants';
import { Linking } from 'react-native';
import {
  RenderAvatar,
  RenderBubble,
  RenderDay,
  RenderFooter,
  RenderInputToolbar,
  RenderLoading,
  RenderSystemMessage,
  RenderTime,
} from './chat-render';
import { css } from '@emotion/native';
import uuid from 'react-native-uuid';
import { requestAnalytics } from '../../../apis/demo';
import { getKoreanServerTodayDateString } from '../../../utils/times';
import { getRiskScore } from '../../../apis/riskscore';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import palette from '../../../assets/styles/theme';
import { useRiskStoreVer2 } from '../../../store/useRiskStoreVer2';
import clickHeaderGiftBoxButton from '../../../utils/analytics';
import Home from '../Home';
import { doesV3KeyExist, getNewIMessagesV3 } from '../../../utils/storageUtils';
import { getV3OldChatting } from '../../../apis/chatting';
import ChatHeader from '../../../components/chatHeader/chatHeader';
import { searchChatWord } from '../../../apis/chatting';
import { ExtendedIMessage } from '../../../utils/chatting';
import { reportMessages } from './chat-render';
import { useCallback } from 'react';
//유저와 챗봇 오브젝트 정의
const userObject = {
  _id: 0,
  name: '나',
};

const botObject = {
  _id: 1,
  name: '쿠키',
  avatar: require('../../../assets/images/cookieprofile.png'),
  //avatar: require(cookieprofile),
};

const NewChat: React.FC = ({ navigation }) => {
  const [init, setInit] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [refreshTimerMS, setRefreshTimerMS] = useState<number>(500);

  const [messages, setMessages] = useState<ExtendedIMessage[]>([]); //채팅 메시지 목록을 관리하는 상태
  const [sending, setSending] = useState<boolean>(false); //메시지를 보내고 있는 중인지 여부를 나타내는 상태
  const [buffer, setBuffer] = useState<string | null>(null); //사용자가 입력한 메시지를 저장하는 임시 버퍼

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); //타이핑 시간을 관리하는 타이머 (초기값 null, 이후 setTimeout의 반환값인 NodeJS.Timeout 객체를 저장)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  //1.5.7 검색 추가
  const nowCursor = React.useRef<string | null | undefined>(undefined); //api 결과값이자 현재 커서 값
  const prevCursor = React.useRef<string | null | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>(''); //검색어
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false); //검색 비활성화
  const [enableUp, setEnableUp] = useState<boolean>(false);
  const [enableDown, setEnableDown] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const { riskStatusV2, riskScoreV2, setRiskScoreV2, setRiskStatusV2, setHandleDangerPressV2 } =
    useRiskStoreVer2();

  //즐겨찾기 함수
  const toggleFavorite = async (messageId: string) => {
    console.log('toggleFavorite 함수 실행', messageId);
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((m) =>
        m._id === messageId ? { ...m, isSaved: !m.isSaved } : m,
      );
      setIMessagesV3(updatedMessages, []); // 변경된 배열을 로컬 저장소에도 업데이트
      return updatedMessages;
    });

    const targetMessage = messages.find((m) => m._id === messageId);
    if (targetMessage) {
      await reportMessages(messageId, targetMessage.isSaved);
    }
    //console.log('setMessages', messages);
  };

  const decideRefreshScreen = (viewHeight: number) => {
    NavigationBar.getVisibilityAsync().then((navBarStatus) => {
      if (navBarStatus === 'visible') {
        const screenHeight = Dimensions.get('screen').height;
        if (
          screenHeight - 2 < viewHeight &&
          viewHeight < screenHeight + 2 &&
          getRefreshChat() <= 2
        ) {
          addRefreshChat(1);
          //navigation.replace(HomeStackName.NewChatRefresh);
        }
      }
      setScreenLoading(false);
    });
  };

  const getIMessageFromServer = async (lastMessageDate: Date): Promise<ExtendedIMessage[]> => {
    //console.log('4️⃣4️⃣4️⃣4️⃣4️⃣4️⃣4️⃣getIMessageFromServer4️⃣4️⃣4️⃣4️⃣4️⃣ 실행', getIMessageFromServer);
    const messages: ExtendedIMessage[] = [];
    const lastDateAddSecond = new Date(lastMessageDate.getTime() + 10 * 1000);
    const serverMessages = await getOldChatting(botObject._id, lastDateAddSecond.toISOString());
    console.log('⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️serverMessages⭐️⭐️⭐️⭐️⭐️', serverMessages);

    /*console.log(
      'true / false',
      serverMessages && serverMessages.chats && serverMessages.chats.length > 0,
    );*/

    if (serverMessages && serverMessages.chats && serverMessages.chats.length > 0) {
      for (let i = 0; i < serverMessages.chats.length; i++) {
        const chat = serverMessages.chats[i];
        const text = chat.text;
        const texts = text.split('\n');
        for (let j = 0; j < texts.length; j++) {
          const text = texts[j];
          let splitTexts: string[] = [text];
          if (chat.status !== 'user') {
            splitTexts =
              text.match(
                /\s*([^.!?;:…。？！~…」»]+[.!?;:…。？！~…」»](?:\s*[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]*)?)\s*/gu,
              ) || [];
          }

          for (let k = 0; k < splitTexts.length; k++) {
            if (splitTexts[k] === '') continue;
            messages.push({
              _id: uuid.v4().toString(),
              text: splitTexts[k],
              createdAt: new Date(new Date(chat.utcTime).getTime()),
              user: chat.status === 'user' ? userObject : botObject,
              isSaved: serverMessages.chats[i].isSaved,
              hightlightKeyword: '',
            }); //대화 내용을 messages에 추가
          }
        }
      }
    }
    //console.log('😀😀😀😀😀😀😀reverse 이전', messages);
    return messages.reverse();
  };

  //1.5.7v3 서버에서 대화 내용을 불러오는 함수
  const v3getIMessageFromServer = async (lastMessageDate: Date): Promise<ExtendedIMessage[]> => {
    const messages: ExtendedIMessage[] = [];
    const lastDateAddSecond = new Date(lastMessageDate.getTime() + 10 * 1000);
    const serverMessages = await getV3OldChatting(botObject._id, lastDateAddSecond.toISOString());
    //console.log('v3 데이터 확인하기', serverMessages);
    if (serverMessages && serverMessages.chats && serverMessages.chats.length > 0) {
      for (let i = 0; i < serverMessages.chats.length; i++) {
        messages.push({
          _id: serverMessages.chats[i].id,
          text: serverMessages.chats[i].text,
          createdAt: new Date(new Date(serverMessages.chats[i].utcTime).getTime()),
          user: serverMessages.chats[i].status === 'user' ? userObject : botObject,
          isSaved: serverMessages.chats[i].isSaved,
          hightlightKeyword: '',
        }); //대화 내용을 messages에 추가
      }
    }
    return messages.reverse();
  };

  //대화 내용을 불러오는 getHistory 함수
  const getHistory = async (): Promise<ExtendedIMessage[]> => {
    // 1. 로컬에서 먼저 저장된 대화 내역들을 가지고 온다.
    // 로그아웃을 하고 다시 실행하면, 디바이스에 저장한 대화를 삭제하기 때문에 undefined이다.
    // 반대로 로그아웃 이후 한 번이라도 대화를 하게 되면 디바이스에 실시간으로 모든 대화들이 저장이 되기 때문에 모든 대화 로그가 있음
    let messages: ExtendedIMessage[] = [];
    const isV3KeyExist = doesV3KeyExist();
    //console.log('getHistory 실행', isV3KeyExist);
    //deleteNewIMessagesV3(); //이거 삭제하기

    if (!isV3KeyExist) {
      //v3 키가 존재하지 않는 경우
      console.log('🔑🔑🔑🔑🔑🔑🔑🔑🔑v3 키가 존재하지 않음🔑🔑🔑🔑🔑🔑🔑🔑', isV3KeyExist);
      const v3lastMessageDate = new Date(0);
      const v3ServerMessages = await v3getIMessageFromServer(v3lastMessageDate); //전체 데이터 가져오기
      if (v3ServerMessages && v3ServerMessages.length > 0) {
        console.log('💚💚💚💚💚💚💚💚💚💚💚이전에 썼던 사람 마이그레이션 하기💚💚💚💚💚💚💚💚');
        setNewIMessagesV3(JSON.stringify(v3ServerMessages)); //로컬 마이그레이션
        deleteNewIMessages(); //v3 이전 로컬 데이터 삭제
        messages = [...v3ServerMessages, ...messages]; //데이터 화면에 보여주기
      } else {
        //새로 온 사람
        console.log('🤖🤖🤖🤖🤖🤖🤖🤖새로 온 사람🤖🤖🤖🤖🤖🤖🤖🤖');
        const welcomeMessage = {
          _id: 'welcomeMessage',
          text: `반가워요, ${getUserNickname()}님!💚 저는 ${getUserNickname()}님 곁에서 힘이 되어드리고 싶은 골든 리트리버 쿠키예요🐶 이 곳은 ${getUserNickname()}님과 저만의 비밀 공간이니, 어떤 이야기도 편하게 나눠주세요!\n\n반말로 대화를 나누고 싶으시다면 위에서 오른쪽에 있는 탭 바를 열고, 반말 모드를 켜 주세요!🍀💕`,
          createdAt: new Date(),
          user: botObject,
          isSaved: false,
          hightlightKeyword: '',
        };
        messages.push(welcomeMessage);
        setNewIMessagesV3(JSON.stringify([welcomeMessage]));
      }
    } else {
      //v3 키가 존재하는 경우
      //console.log('👯👯👯👯👯👯👯👯v3 키가 존재함👯👯👯👯👯👯', isV3KeyExist);
      const v3DeviceHistory = getNewIMessagesV3();
      if (v3DeviceHistory) {
        const v3DeviceArray = JSON.parse(v3DeviceHistory);
        messages.push(...v3DeviceArray);
      }
      //console.log('🦈🦈🦈🦈🦈🦈v3DeviceHistory', v3DeviceHistory);
      const v3lastMessageDate: Date =
        messages.length > 0 ? new Date(messages[0].createdAt) : new Date(0);
      const v3ServerMessages = await v3getIMessageFromServer(v3lastMessageDate);
      messages = [...v3ServerMessages, ...messages];
    }
    return messages;
  };

  const setIMessages = (previousMessages: ExtendedIMessage[], newMessages: ExtendedIMessage[]) => {
    const messagesString = JSON.stringify([...newMessages, ...previousMessages]);
    setNewIMessages(messagesString);
  };

  //v3로 저장된 메시지들을 로컬에 저장하는 함수
  const setIMessagesV3 = (
    previousMessages: ExtendedIMessage[],
    newMessages: ExtendedIMessage[],
  ) => {
    const messagesString = JSON.stringify([...newMessages, ...previousMessages]);
    setNewIMessagesV3(messagesString);
  };

  //버퍼에 저장된 메시지를 서버로 전송하는 sendMessageToServer 함수
  const sendMessageToServer = () => {
    if (!buffer || sending) return;
    setSending(true);
    const question = buffer ?? '';
    const isDemo = getIsDemo();
    chatting(1, question, isDemo) //버퍼에 저장된 메세지를 서버로 전송하여 질문 & 대화 전체 쌍을 받아옴
      .then((res) => {
        //console.log('v3로 받은 유저와 쿠키의 답변', res);
        //console.log('getOldChatting 결과', getNewIMessagesV3());
        //console.log('화면에 나오는 메세지들', messages); //최신순으로 저장되어있음. messages[0]이 내가 보낸 가장 마지막 메세지
        if (res) {
          //const newMessages: IMessage[] = [];
          //console.log('현재 저장된 메세지들', messages);
          const sortedMessages = res?.reverse(); //결과를 역순으로 정렬하여 최신 메세지가 앞으로
          const apiQuestions = sortedMessages.filter(
            (item) => item.question !== null && item.question !== '' && item.answer === null,
          );
          const apiAnswers = sortedMessages.filter(
            (item) => item.answer !== null && item.question === null,
          );

          setMessages((previousMessages) => {
            const updatedMessages = [...previousMessages];
            for (let i = 0; i < apiQuestions.length; i++) {
              /*console.log('apiQuestions[i]', apiQuestions[i]);
              console.log('updatedMessages[i]', updatedMessages[i]);
              console.log('apiQuestions[i].question', apiQuestions[i].question);
              console.log('updatedMessages[i].text', updatedMessages[i].text);
              console.log('updatedMessages[i]._id', updatedMessages[i]._id);
              console.log('apiQuestions[i].id', apiQuestions[i].id);*/
              if (updatedMessages[i] && updatedMessages[i].text === apiQuestions[i].question) {
                updatedMessages[i] = {
                  ...updatedMessages[i],
                  _id: apiQuestions[i].id,
                };
              }
            }
            // API 응답에서 봇의 대답들만 필터링했다고 가정 (예: apiAnswers)
            const newBotMessages: ExtendedIMessage[] = apiAnswers.map((item, idx) => ({
              _id: item.id,
              text: item.answer ?? '', // API에서 받은 봇의 대답 텍스트
              createdAt: new Date(), // 생성 시간 (API에 createdAt이 없으면 현재 시간에 idx를 더해서 대체)
              user: botObject, // 봇을 나타내는 user 객체
              isSaved: false,
            }));

            //setIMessages(updatedMessages, newMessages.reverse());
            setIMessagesV3(updatedMessages, newBotMessages);
            /*console.log(
              '🥵🥵🥵🥵🥵🥵🥵확인하기 : 로컬에 저장된 값🥵🥵🥵🥵🥵🥵🥵',
              getNewIMessagesV3(),
            );*/
            return GiftedChat.append(updatedMessages, newBotMessages);
          });
        }
      })
      .catch((err) => {
        const newMessages: ExtendedIMessage[] = [
          {
            _id: uuid.v4().toString(),
            text: ERRORMESSAGE,
            createdAt: new Date(),
            user: botObject,
            isSaved: false,
          },
        ];
        setMessages((previousMessages) => {
          setIMessagesV3(previousMessages, newMessages);
          return GiftedChat.append(previousMessages, newMessages);
        });
      })
      .finally(() => {
        setBuffer(null);
        setSending(false);
      });
  };

  /*
  디바운싱을 담당하는 resetTimer 함수
    1. 타이머가 돌아가고 있다면 타이머를 초기화한다
    2. 입력이 모두 끝나고 2초 후에 타이머가 sendMessageToServer() 함수를 실행한다.
  */
  const resetTimer = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendMessageToServer();
    }, 2 * 1000);
  };

  /*
  resetRefreshTimer 함수
  */
  const resetRefreshTimer = (height: number, ms: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    setScreenLoading(true);
    refreshTimeoutRef.current = setTimeout(() => {
      decideRefreshScreen(height);
    }, Math.floor(ms));
  };

  // 검색어에 해당하는 메시지의 highlight 키워드를 업데이트하는 함수
  const updateMessageHighlights = (keyword: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        // 검색어가 포함되어 있으면 highlight 키워드로 업데이트, 없으면 빈 문자열로 초기화
        msg.text.includes(keyword)
          ? { ...msg, hightlightKeyword: keyword }
          : { ...msg, hightlightKeyword: '' },
      ),
    );
  };

  //키워드를 검색하여 id값을 반환해주는 handleSearch 함수
  const handleSearch = async (
    text: string,
    direction: null | 'up' | 'down',
  ): Promise<string | null> => {
    console.log('새 함수 검색어 : ', text, direction, nowCursor.current);
    setSearchLoading(true);

    // 스크롤 함수가 없거나 더 이상 검색 결과가 없을 경우
    if (!scrollToMessageById || (nowCursor.current === null && prevCursor.current === null)) {
      console.log('검색 결과가 없습니다');
      Toast.show(`검색 결과가 없습니다`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
      });
      setSearchLoading(false);
      nowCursor.current = undefined; // 초기화
      return null;
    }

    let res: any; // searchChatWord의 반환값 타입에 맞게 수정

    // 검색 방향에 따른 커서 선택
    if (direction === 'up' || direction === null) {
      const apiCursor: string | null = nowCursor.current === undefined ? null : nowCursor.current;
      res = await searchChatWord(text, apiCursor, direction);
    } else if (direction === 'down') {
      const apiCursor: string | null = prevCursor.current;
      res = await searchChatWord(text, apiCursor, direction);
    }

    // 커서 업데이트
    prevCursor.current = nowCursor.current;
    nowCursor.current = res?.nextCursor ?? null;
    setSearchLoading(false);

    if (res?.nextCursor) {
      scrollToMessageById(res.nextCursor);
      updateMessageHighlights(text); //messages의 hightlight 변경
      if (direction === 'up' || direction === null) {
        // 최초 검색인 경우(prevCursor.current가 null 또는 undefined)
        if (prevCursor.current === undefined || prevCursor.current === null) {
          setEnableUp(true);
          setEnableDown(false); // 최초 검색: down 버튼 비활성화
        } else {
          setEnableUp(true);
          setEnableDown(true); // 후속 up 검색: 양쪽 모두 활성화
        }
      } else if (direction === 'down') {
        // down 버튼 클릭: 이전으로 되돌아갔으므로 up 버튼만 활성화
        setEnableUp(true);
        setEnableDown(false);
      }
    } else {
      // 검색 결과가 없는 경우: 요구사항 4 - 둘 다 비활성화
      updateMessageHighlights('');
      if (direction === 'up') {
        setEnableDown(true);
        setEnableUp(false);
        Toast.show(`더 이상 검색 결과가 존재하지 않습니다`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
      } //위로 더 못 가는 경우
      else {
        setEnableUp(false);
        setEnableDown(false);
        Toast.show(`검색 결과가 없습니다`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
        prevCursor.current = undefined; // 초기화
        nowCursor.current = undefined; // 초기화
      }
    }
    return res?.nextCursor;
  };

  // 메시지 id로부터 메시지 인덱스를 찾아 해당 메시지로 스크롤하는 scrollToMessageById 함수
  // 메시지 id로부터 메시지 인덱스를 찾아 해당 메시지로 스크롤하는 scrollToMessageById 함수
  // 예시: 메시지 id로부터 인덱스를 찾고 스크롤하는 함수
  const scrollToMessageById = async (messageId: string | number) => {
    const index = messages.findIndex((message) => message._id === messageId);
    if (index === -1) {
      console.log('해당 메시지를 찾을 수 없습니다.');
      return;
    }
    console.log(`Scrolling to index ${index} for message id: ${messageId}`);
    //attemptScroll(index);
    await smoothLazyScrollToIndex(index);
  };

  // 재귀적으로 스크롤을 시도하는 함수
  const attemptScroll = (targetIndex: number) => {
    // 더 이상 내려갈 인덱스가 없으면 종료
    if (targetIndex < 0) return;

    // 약간의 딜레이 후 스크롤 시도 (lazy loading으로 렌더링 시간 확보)
    setTimeout(() => {
      try {
        // FlatList 혹은 GiftedChat의 메시지 컨테이너 ref를 사용하여 scrollToIndex 호출
        messageContainerRef.current?.scrollToIndex({
          index: targetIndex,
          animated: true,
          viewOffset: 0, // 메시지 시작 부분에 맞춤 (필요시 조절)
          viewPosition: 0, // 0: 상단 정렬, 0.5: 중앙, 1: 하단 정렬
        });
        console.log(`Index ${targetIndex}으로 스크롤 성공.`);
      } catch (error) {
        console.warn(
          `Index ${targetIndex}로 스크롤 실패. fallback으로 ${targetIndex - 1} 시도합니다.`,
          error,
        );
        // 실패 시 index를 하나 낮춰 재귀적으로 호출
        attemptScroll(targetIndex - 1);
      }
    }, 150);
  };
  //추가
  const smoothLazyScrollToIndex = async (
    targetIndex: number,
    step = 5,
    delay = 150,
    maxAttempts = 10,
  ) => {
    let currentOffset = targetIndex * 20; //20 : ITEM_HEIGHT
    let attempt = 0;

    for (; attempt < maxAttempts; attempt++) {
      try {
        messageContainerRef.current?.scrollToIndex({
          index: targetIndex,
          animated: true,
          viewOffset: 0,
          viewPosition: 0,
        });
        console.log(`✅ Index ${targetIndex}으로 스크롤 성공.`);
        return;
      } catch (error) {
        console.warn(
          `⚠️ Attempt ${attempt + 1}: Index ${targetIndex} 스크롤 실패. 위로 preload 시도 중...`,
        );

        currentOffset -= step * 20;
        if (currentOffset < 0) currentOffset = 0;

        messageContainerRef.current?.scrollToOffset({
          offset: currentOffset,
          animated: false,
        });

        await new Promise((res) => setTimeout(res, delay));
      }
    }

    console.warn('❌ 최대 시도 횟수 초과. 리스트 최상단으로 이동합니다.');
    messageContainerRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  /* 
  채팅 화면이 처음 보였을 때 대화 기록을 가지고 오는 과정
  getHistory() : 서버에서 그 동안의 모든 대화 히스토리를 가지고 옴
  ** 성공할 경우 (then) : 서버에서 가지고 온 대화인 messageHistory를 messages 상태에 저장
  ** 실패할 경우 (catch) : 사용자에게 안내와 함께 홈 화면으로 이동
  */
  useEffect(() => {
    //console.log('===========useEffect 실행===========');
    setInit(true);
    if (getRefreshChat() === 0) {
      Analytics.watchNewChatScreen();
    }
    //console.log('🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨🫨');
    getHistory()
      .then((messageHistory) => {
        //console.log('😀😀😀😀😀😀useEffect 결과😀😀😀😀', messageHistory);
        setMessages(messageHistory);
        setInit(false);
      })
      .catch((err) => {
        alert('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
        console.log(err);
        navigation.navigate(TabScreenName.Home);
      });
  }, []);

  // useFocusEffect를 사용하여 화면이 포커스될 때마다 refresh flag를 확인
  useFocusEffect(
    useCallback(() => {
      if (getRefreshChat() > 0) {
        // refresh flag가 설정되어 있다면 메시지를 새로 불러오고 flag를 초기화
        setRefreshChat(0);
        setInit(true);
        getHistory()
          .then((messageHistory) => {
            setMessages(messageHistory);
            setInit(false);
          })
          .catch((err) => {
            console.log('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
            console.log(err);
            navigation.navigate('Home');
          });
      }
    }, [navigation]),
  );

  //비행기를 클릭헀을 때 실행되는 onSend 함수
  //api 로 유저 - 채팅 한 쌍을 받아오기 전에는 id 값을 임의로 설정하여 화면에 보여준다.
  const onSend = (newMessages: ExtendedIMessage[] = []) => {
    if (!newMessages[0].text.trim()) {
      return;
    }
    setBuffer(buffer ? buffer + newMessages[0].text + '\t' : newMessages[0].text + '\t');
    setMessages((previousMessages) => {
      //setIMessagesV3(previousMessages, newMessages.reverse());
      return GiftedChat.append(previousMessages, newMessages);
    });
  };

  //버퍼가 변경됨에 따라 타이머를 재설정함
  //타이머 = 유저의 타이핑 시간 (연속된 타이핑인지를 체크)
  useEffect(() => {
    if (buffer) {
      resetTimer();
    }
  }, [buffer]);

  const showToast = () => {
    Toast.show('메시지가 복사했습니다.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRiskScoreV2;
    });
    // 컴포넌트 unmount 시 리스너를 해제
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const messageContainerRef = useRef<React.ElementRef<typeof GiftedChat>>(null);

  /* 채팅 화면 전체 구성 */
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={['bottom']}
      onLayout={(event) => {
        if (Platform.OS === 'android') {
          const { height } = event.nativeEvent.layout;
          resetRefreshTimer(height, refreshTimerMS);
          setRefreshTimerMS(refreshTimerMS / 2);
        } else {
          setScreenLoading(false);
        }
      }}>
      {(screenLoading || init) && (
        <View
          style={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            pointer-events: none;
            background-color: #ffffff;
          `}>
          <RenderLoading />
        </View>
      )}

      <ChatHeader
        isSearchMode={isSearchMode}
        setIsSearchMode={setIsSearchMode}
        riskStatusV2={riskStatusV2}
        isEvent={true}
        isRight={true}
        isLeft={true}
        leftFunction={() => {
          navigation.popToTop(); // 스택 최상단으로 이동
          navigation.navigate(RootStackName.BottomTabNavigator, {
            screen: TabScreenName.Home,
          });
          Analytics.clickHeaderBackButton();
        }}
        rightFunction={() => {
          if (!isSearchMode) {
            //console.log('사이드바 열기');
            navigation.openDrawer();
            Analytics.clickHeaderSideMenuButton();
          }
        }}
        eventFunction={() => {
          //console.log('돋보기 버튼을 누름');
          Analytics.clickHeaderSearchButton();
          setIsSearchMode((prev) => !prev);
        }}
        scrollToMessageById={scrollToMessageById}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        handleSearch={handleSearch}
        updateMessageHighlights={updateMessageHighlights}
      />
      <GiftedChat
        messageContainerRef={messageContainerRef}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={userObject}
        onInputTextChanged={(text) => {
          if (typingTimeoutRef.current) {
            resetTimer();
          }
        }}
        renderAvatar={RenderAvatar}
        showAvatarForEveryMessage
        renderAvatarOnTop
        onPressAvatar={() => {
          navigation.navigate(HomeStackName.Profile);
        }}
        onLongPressAvatar={() => {
          if (getIsDemo()) setIsScoreDemo(true);
        }}
        renderBubble={(props) => <RenderBubble {...props} onFavoritePress={toggleFavorite} />}
        onLongPress={(context, message: IMessage) => {
          Clipboard.setStringAsync(message.text).then(() => {
            showToast();
          });
        }}
        renderFooter={() => RenderFooter(sending)}
        renderTime={RenderTime}
        renderDay={RenderDay}
        renderSystemMessage={RenderSystemMessage}
        renderInputToolbar={(sendProps: SendProps<ExtendedIMessage>) =>
          RenderInputToolbar(
            sendProps,
            sending,
            isSearchMode,
            enableUp,
            enableDown,
            setEnableUp,
            setEnableDown,
            handleSearch,
            searchWord,
          )
        }
        textInputProps={{
          placeholder: getIsDemo() ? '메시지 입력.' : '메시지 입력',
          marginLeft: rsWidth * 15,
        }}
        keyboardShouldPersistTaps={'never'}
        alwaysShowSend
      />
      {searchLoading && (
        <View
          style={{
            position: 'absolute', // 절대 위치 지정
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999, // 다른 컴포넌트보다 위에 렌더링
          }}>
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
};

export default NewChat;

// 위험 감지 이전 코드
/*
const refreshRiskStatus = () => {
  const riskData = getRiskData();
  if (!riskData) setRiskStatus('safe');
  else if (riskData.isRead) setRiskStatus('danger-opened');
  else setRiskStatus('danger');
  //setRiskStatus('danger');
};*/

/*
채팅 스크린에 처음 진입 시, 위험 지수를 받아와서 화면에 업데이트를 해 주어야 함
따라서 스크린 포커스 시 위험 점수를 받아올 수 있도록 리스너를 추가.
스크린 밖을 나갈 때 (= 컴포넌트 언마운트) 리스너를 해제하여 메모리 누수를 방지
*/
/*
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', refreshRiskScore);
  // 컴포넌트 unmount 시 리스너를 해제
  return () => {
    unsubscribe();
  };
}, [navigation]);*/
//헤더 아이콘 클릭했을 때 이동 페이지
/*
  const handleDangerPress = () => {
    if (riskStatus === 'danger') {
      Analytics.clickDangerLetterButton(riskScore);
      const letterIndex = Math.floor(Math.random() * DANGER_LETTER.length);
      setRiskData({
        timestamp: new Date().getTime(),
        isRead: true,
        letterIndex,
      });
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
        params: { letterIndex },
      }); //쿠키 편지 화면으로 이동한다
      return;
    }
    if (riskStatus === 'danger-opened') {
      //위험한 상태일 때 확인을 했으면
      Analytics.clickOpenedDangerLetterButton(riskScore);
      const letterIndex = getRiskData()?.letterIndex;
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
        params: { letterIndex: letterIndex ?? 0 },
      }); //쿠키 편지 화면으로 이동한다
      return;
    }
    if (riskStatus === 'safe') {
      //setHintStatus(true);
      return;
    }
  };*/
/*
  const refreshRiskScore = () => {
    console.log('🥬🥬🥬🥬🥬 refreshRiskScore 🥬🥬🥬🥬');
    const date = getKoreanServerTodayDateString(new Date());
    getRiskScore(date).then((res) => {
      setRiskScore(res);
      if (res >= RISK_SCORE_THRESHOLD && !getRiskData()) {
        setRiskData({
          timestamp: new Date().getTime(),
          isRead: false,
          letterIndex: null,
        });
      }
      refreshRiskStatus();
    });
  };*/
//const [riskScore, setRiskScore] = React.useState<number>(0);
//const [riskStatus, setRiskStatus] = React.useState<'safe' | 'danger' | 'danger-opened'>('safe');

//import cookieprofile from '@assets/images/cookieprofile.png';
//import cookieProfile from '@assets/images/cookieprofile.png';

//const HINT_MESSAGE = 'AI로 생성된 답변입니다. 상담 필요 시 전문가와 상의하세요.';
//console.log('이벤트 누름');
//await Linking.openURL(
//'https://autumn-flier-d18.notion.site/reMIND-1b48e75d989680f2b4c7e7fa8dbfc1ad?pvs=4',
//);
//Analytics.clickHeaderGiftBoxButton(
//'https://autumn-flier-d18.notion.site/reMIND-1b48e75d989680f2b4c7e7fa8dbfc1ad?pvs=4',
//);
