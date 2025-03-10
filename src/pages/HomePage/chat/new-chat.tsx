import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, SendProps } from 'react-native-gifted-chat';
import Header from '../../../components/header/header';
import {
  DANGER_LETTER,
  DangerStackName,
  ERRORMESSAGE,
  HomeStackName,
  RISK_SCORE_THRESHOLD,
  RootStackName,
} from '../../../constants/Constants';
import * as NavigationBar from 'expo-navigation-bar';
import {
  addRefreshChat,
  getIsDemo,
  getNewIMessages,
  getRefreshChat,
  getRiskData,
  getUserNickname,
  setIsScoreDemo,
  setNewIMessages,
  setRiskData,
} from '../../../utils/storageUtils';
import Analytics from '../../../utils/analytics';
import { rsFont, rsWidth } from '../../../utils/responsive-size';
import { chatting, getOldChatting } from '../../../apis/chatting';
import { TabScreenName } from '../../../constants/Constants';
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
import { Hint } from 'react-native-ui-lib';
import palette from '../../../assets/styles/theme';
import { useRiskStoreVer2 } from '../../../store/useRiskStoreVer2';
//import cookieprofile from '@assets/images/cookieprofile.png';
//import cookieProfile from '@assets/images/cookieprofile.png';

//const HINT_MESSAGE = 'AI로 생성된 답변입니다. 상담 필요 시 전문가와 상의하세요.';

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

  const [messages, setMessages] = useState<IMessage[]>([]); //채팅 메시지 목록을 관리하는 상태
  const [sending, setSending] = useState<boolean>(false); //메시지를 보내고 있는 중인지 여부를 나타내는 상태
  const [buffer, setBuffer] = useState<string | null>(null); //사용자가 입력한 메시지를 저장하는 임시 버퍼

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); //타이핑 시간을 관리하는 타이머 (초기값 null, 이후 setTimeout의 반환값인 NodeJS.Timeout 객체를 저장)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { riskStatusV2, riskScoreV2, setRiskScoreV2, setRiskStatusV2, setHandleDangerPressV2 } =
    useRiskStoreVer2();

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

  const getIMessageFromServer = async (lastMessageDate: Date): Promise<IMessage[]> => {
    const messages: IMessage[] = [];
    const lastDateAddSecond = new Date(lastMessageDate.getTime() + 10 * 1000);
    const serverMessages = await getOldChatting(botObject._id, lastDateAddSecond.toISOString());

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
            }); //대화 내용을 messages에 추가
          }
        }
      }
    }
    return messages.reverse();
  };

  /*
  1. 대화 내역을 가지고 오는 getHistory 함수
    서버에서 그 동안의 대화 내역을 가지고 오며, 대화 내역이 없는 경우 환영 메세지를 추가하여 반환
  2. 비동기 처리가 완료된 후 리턴 타입
    Imssage[] (배열)
  -> 왜 로컬에서 대화를 먼저 가지고 오고, 서버에서 그 동안의 대화를 가지고 오는가?
  */
  const getHistory = async (): Promise<IMessage[]> => {
    //대화 내역을 가져오는 함수
    let messages: IMessage[] = [];
    const deviceHistory = getNewIMessages();
    //console.log('🎊🎊🎊🎊🎊🎊deviceHistory🎊🎊🎊🎊🎊', deviceHistory);
    if (deviceHistory) {
      const deviceArray = JSON.parse(deviceHistory);
      messages.push(...deviceArray);
    } //이 부분 주석 처리하면 웰컴 메세지가 없음

    const lastMessageDate: Date =
      messages.length > 0 ? new Date(messages[0].createdAt) : new Date(0);
    const serverMessages = await getIMessageFromServer(lastMessageDate);
    messages = [...serverMessages, ...messages];

    //대화 내역이 없을 경우, 환영 메시지를 추가
    if (messages.length === 0) {
      const welcomeMessage = {
        _id: new Date().getTime(),
        text: `반가워요, ${getUserNickname()}님!💚 저는 ${getUserNickname()}님 곁에서 힘이 되어드리고 싶은 골든 리트리버 쿠키예요🐶 이 곳은 ${getUserNickname()}님과 저만의 비밀 공간이니, 어떤 이야기도 편하게 나눠주세요!\n\n 반말로 대화를 나누고 싶으시다면 맨 위에 오른쪽 탭 바를 열고, 반말 모드를 켜 주세요!🍀💕`,
        createdAt: new Date(),
        user: botObject,
      };
      messages.push(welcomeMessage);
      setNewIMessages(JSON.stringify([welcomeMessage]));
    }

    return messages;
  };

  const setIMessages = (previousMessages: IMessage[], newMessages: IMessage[]) => {
    const messagesString = JSON.stringify([...newMessages, ...previousMessages]);
    setNewIMessages(messagesString);
  };

  //유저가 서버로 메세지를 보내는 sendMessageToServer 함수
  const sendMessageToServer = () => {
    if (!buffer) return;
    setSending(true);
    const question = buffer ?? '';
    const isDemo = getIsDemo();
    chatting(1, question, isDemo)
      .then((res) => {
        if (res && res.answer) {
          const answers =
            res.answer.match(
              /\s*([^.!?;:…。？！~…」»]+[.!?;:…。？！~…」»](?:\s*[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]*)?)\s*/gu,
            ) || [];
          const newMessages: IMessage[] = [];
          for (let i = 0; i < answers.length; i++) {
            newMessages.push({
              _id: uuid.v4().toString(),
              text: answers[i],
              createdAt: new Date(new Date().getTime() + i),
              user: botObject,
            });
          }
          setMessages((previousMessages) => {
            setIMessages(previousMessages, newMessages.reverse());
            return GiftedChat.append(previousMessages, newMessages);
          });
        }
      })
      .catch((err) => {
        const newMessages: IMessage[] = [
          {
            _id: uuid.v4().toString(),
            text: ERRORMESSAGE,
            createdAt: new Date(),
            user: botObject,
          },
        ];
        setMessages((previousMessages) => {
          setIMessages(previousMessages, newMessages.reverse());
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
    getHistory()
      .then((messageHistory) => {
        //console.log('messageHistory', messageHistory);
        setMessages(messageHistory);
        setInit(false);
      })
      .catch((err) => {
        alert('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
        navigation.navigate(TabScreenName.Home);
      });
  }, []);

  /*
  1. onSend 함수
    비행기 버튼을 눌렀을 때 실행되는 메세지 전송 버튼, 매개변수로 내가 TextInput에 작성한 newMessages를 받음
    newMessages : [{"_id": "953961d0-d7c3-4f43-9275-a7ba62157062", "createdAt": 2025-02-27T03:33:31.172Z, "text": "바부", "user": {"_id": 0, "name": "나"}}]
    *** 빈 화면에서 전송 버튼을 누르면 실행되지 않으나.. 버튼을 비활성화 시키는 게 더 현명해보임
    *** 유저가 작성한 메세지가 여러 개인 경우 buffer로 쌓이고, 최종 전송될 때 buffer에 있는 메세지 전부 보냄
    *** 보낼 때 한 줄 씩 띄워서 전송하게 됨
  */
  const onSend = (newMessages: IMessage[] = []) => {
    Analytics.clickChatSendButton();
    if (!newMessages[0].text.trim()) {
      console.log('실행 안됨');
      return;
    }
    setBuffer(buffer ? buffer + newMessages[0].text + '\n' : newMessages[0].text + '\n');
    setMessages((previousMessages) => {
      setIMessages(previousMessages, newMessages.reverse());
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
    const unsubscribe = navigation.addListener('focus', setRiskScoreV2);
    // 컴포넌트 unmount 시 리스너를 해제
    return () => {
      unsubscribe();
    };
  }, [navigation]);

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

      <Header
        title="쿠키의 채팅방"
        leftFunction={() => {
          Analytics.clickHeaderBackButton();
          if (getIsDemo()) requestAnalytics();
          navigation.navigate(TabScreenName.Home);
        }}
        isRight={true}
        rightIcon={riskStatusV2 !== 'danger' ? 'side-menu-bar' : 'side-menu-bar-alert'}
        rightFunction={() => {
          Analytics.clickHeaderSideMenuButton();
          navigation.openDrawer();
        }}
      />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={userObject}
        onInputTextChanged={(text) => {
          if (typingTimeoutRef.current) {
            resetTimer();
          }
        }}
        isStatusBarTranslucentAndroid
        renderAvatar={RenderAvatar}
        showAvatarForEveryMessage
        renderAvatarOnTop
        onPressAvatar={() => {
          Analytics.clickChatCharacterAvatar();
          navigation.navigate(HomeStackName.Profile);
        }}
        onLongPressAvatar={() => {
          if (getIsDemo()) setIsScoreDemo(true);
        }}
        renderBubble={RenderBubble}
        onLongPress={(context, message: IMessage) => {
          Clipboard.setStringAsync(message.text).then(() => {
            showToast();
          });
        }}
        renderFooter={() => RenderFooter(sending)}
        renderTime={RenderTime}
        renderDay={RenderDay}
        renderSystemMessage={RenderSystemMessage}
        renderInputToolbar={(sendProps: SendProps<IMessage>) =>
          RenderInputToolbar(sendProps, sending)
        }
        //renderComposer={RenderComposer}
        textInputProps={{
          placeholder: getIsDemo() ? '메시지 입력.' : '메시지 입력',
          marginLeft: rsWidth * 15,
        }}
        keyboardShouldPersistTaps="never"
        //renderSend={(sendProps: SendProps<IMessage>) => RenderSend(sendProps, sending)}
        alwaysShowSend
      />
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
